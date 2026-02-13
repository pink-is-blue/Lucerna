from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback
from pydantic import BaseModel
import numpy as np
from simulation.neuron import generate_neuron_population
from simulation.field import discretize_neuron_current, compute_biot_savart
from odmr import field_to_frequency_shift, add_noise

app = FastAPI(title="Lucerna Simulation API")

# Allow the frontend (Next.js dev server) to call this API from the browser
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimRequest(BaseModel):
    n_neurons: int = 100
    area: list = [0.0, 1.0, 0.0, 1.0]
    z_range: list = [0.0, 0.2]
    mean_length: float = 0.5
    n_time: int = 40
    t_max: float = 0.01
    sensor_res: int = 32
    rng_seed: int = 0


@app.post("/simulate")
def simulate(req: SimRequest):
    try:
        rng = np.random.default_rng(req.rng_seed)
        neurons = generate_neuron_population(n_neurons=req.n_neurons,
                                             area=tuple(req.area),
                                             z_range=tuple(req.z_range),
                                             mean_length=req.mean_length,
                                             rng=rng)

        # build sensor grid in XY at z=0 (NV layer)
        xmin,xmax,ymin,ymax = req.area
        xs = np.linspace(xmin, xmax, req.sensor_res)
        ys = np.linspace(ymin, ymax, req.sensor_res)
        XX,YY = np.meshgrid(xs, ys)
        sensor_points = np.stack([XX.ravel(), YY.ravel(), np.zeros_like(XX).ravel()], axis=1)

        n_time = req.n_time
        times = np.linspace(0, req.t_max, n_time)

        # placeholder B-field array (N_sensors, n_time, 3)
        N = sensor_points.shape[0]
        Btime = np.zeros((N, n_time, 3), dtype=float)

        # For each time, sum contributions from all neurons
        for ti, t in enumerate(times):
            segments_all_s = []
            segments_all_e = []
            currents_all = []
            for neuron in neurons:
                pts = neuron['pts']
                tang = neuron['tangents']
                L = pts.shape[0]
                # define waveform along neuron: moving Gaussian pulse
                # param s in [0,1] across curve
                s = np.linspace(0.0, 1.0, L)
                # pulse center moves with velocity v (units curve per second). choose v proportional to length
                v = 0.5  # curve-units / second (adjustable)
                # convert time to center position
                center = (t * v) % 1.0
                sigma = 0.05
                waveform = np.exp(-0.5 * ((s - center) ** 2) / (sigma ** 2))
                s0, s1, currents = discretize_neuron_current(pts, tang, waveform, current_amplitude=1.0)
                segments_all_s.append(s0)
                segments_all_e.append(s1)
                currents_all.append(currents)
            # concatenate
            seg_s = np.concatenate(segments_all_s, axis=0)
            seg_e = np.concatenate(segments_all_e, axis=0)
            cur = np.concatenate(currents_all, axis=0)
            # compute B
            B = compute_biot_savart(seg_s, seg_e, cur, sensor_points)
            Btime[:, ti, :] = B

        # return compact JSON: grid shape, xs, ys, times, and B flattened
        return {
            'xs': xs.tolist(),
            'ys': ys.tolist(),
            'times': times.tolist(),
            'Bshape': Btime.shape,
            'B': Btime.reshape((-1,3)).tolist()  # (N*n_time,3) - consumer will reshape
        }
    except Exception as e:
        tb = traceback.format_exc()
        with open('backend_error.log', 'a', encoding='utf-8') as f:
            f.write('\n--- SIMULATE ERROR ---\n')
            f.write(tb)
        raise HTTPException(status_code=500, detail='Simulation failed; logged backend_error.log')



class OdmrRequest(SimRequest):
    noise_level: float = 0.1
    signal_scale: float = 1.0
    shot_noise: bool = False
    thermal_std: float = 0.0
    drift_std: float = 0.0


@app.post("/odmr")
def odmr(req: OdmrRequest):
    try:
        # reuse simulation to produce B-time series
        sim = simulate(req)
        Bflat = np.array(sim['B'])
        Bshape = tuple(sim['Bshape'])
        Btime = Bflat.reshape(Bshape)

        # compute proxy frequency shift and add noise
        df_clean = field_to_frequency_shift(Btime, signal_scale=req.signal_scale)
        rng = np.random.default_rng(req.rng_seed)
        df_noisy = add_noise(df_clean, noise_level=req.noise_level, shot_noise=req.shot_noise,
                             thermal_std=req.thermal_std, drift_std=req.drift_std, rng=rng)

        return {
            'xs': sim['xs'],
            'ys': sim['ys'],
            'times': sim['times'],
            'df_shape': df_clean.shape,
            'df_clean': df_clean.tolist(),
            'df_noisy': df_noisy.tolist()
        }
    except Exception as e:
        tb = traceback.format_exc()
        with open('backend_error.log', 'a', encoding='utf-8') as f:
            f.write('\n--- ODMR ERROR ---\n')
            f.write(tb)
        raise HTTPException(status_code=500, detail='ODMR processing failed; logged backend_error.log')


class GraphRequest(OdmrRequest):
    spatial_threshold: float = 0.15
    temporal_threshold: int = 1


@app.post("/graph")
def graph_endpoint(req: GraphRequest):
    """Build spatiotemporal graph from ODMR data."""
    try:
        from graph import build_spatiotemporal_graph
        
        # run odmr simulation
        odmr_result = odmr(req)
        df_noisy = np.array(odmr_result['df_noisy'])
        xs = np.array(odmr_result['xs'])
        ys = np.array(odmr_result['ys'])
        times = np.array(odmr_result['times'])
        
        # build graph
        nodes, edges = build_spatiotemporal_graph(df_noisy, xs, ys, times, 
                                                   spatial_threshold=req.spatial_threshold,
                                                   temporal_threshold=req.temporal_threshold)
        
        return {
            'nodes': nodes,
            'edges': edges,
            'n_nodes': len(nodes),
            'n_edges': len(edges)
        }
    except Exception as e:
        tb = traceback.format_exc()
        with open('backend_error.log', 'a', encoding='utf-8') as f:
            f.write('\n--- GRAPH ERROR ---\n')
            f.write(tb)
        raise HTTPException(status_code=500, detail='Graph construction failed')


class DenoiseRequest(OdmrRequest):
    spatial_sigma: float = 1.0
    temporal_sigma: float = 1.0
    n_smooth_iters: int = 3


@app.post("/denoise")
def denoise_endpoint(req: DenoiseRequest):
    """Denoise ODMR data using Gaussian filtering and graph smoothing."""
    try:
        from denoiser import denoise_frequency_shift, graph_smoothing
        from graph import build_spatiotemporal_graph
        
        # run odmr simulation
        odmr_result = odmr(req)
        df_noisy = np.array(odmr_result['df_noisy'])
        xs = np.array(odmr_result['xs'])
        ys = np.array(odmr_result['ys'])
        times = np.array(odmr_result['times'])
        
        # denoise using Gaussian filter (simplified version without full GCNN)
        df_gaussian = denoise_frequency_shift(df_noisy, spatial_sigma=req.spatial_sigma, 
                                              temporal_sigma=req.temporal_sigma)
        
        # skip graph smoothing for now (would require full PyTorch+PyG GCNN)
        df_denoised = df_gaussian
        
        return {
            'xs': odmr_result['xs'],
            'ys': odmr_result['ys'],
            'times': odmr_result['times'],
            'df_shape': df_denoised.shape,
            'df_noisy': odmr_result['df_noisy'],
            'df_denoised': df_denoised.tolist()
        }
    except Exception as e:
        tb = traceback.format_exc()
        with open('backend_error.log', 'a', encoding='utf-8') as f:
            f.write('\n--- DENOISE ERROR ---\n')
            f.write(tb)
        raise HTTPException(status_code=500, detail='Denoising failed')

