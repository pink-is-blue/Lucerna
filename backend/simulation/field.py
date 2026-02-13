import numpy as np

MU0 = 4e-7 * np.pi


def compute_biot_savart(segments_start, segments_end, currents, sensor_points):
    """Compute magnetic field at sensor_points due to multiple short current segments.

    segments_start, segments_end: arrays (M,3)
    currents: scalar or (M,) current magnitudes
    sensor_points: (N,3)

    Returns B: (N,3)
    """
    # Vectorized loop: compute r = r_vec from segment midpoint to sensor
    mid = 0.5 * (segments_start + segments_end)
    dl = (segments_end - segments_start)

    M = mid.shape[0]
    N = sensor_points.shape[0]

    # Expand arrays for vectorized cross products (may use memory but simpler)
    mid_exp = mid[None, :, :]  # (1,M,3)
    dl_exp = dl[None, :, :]    # (1,M,3)
    sens_exp = sensor_points[:, None, :]  # (N,1,3)

    r = sens_exp - mid_exp  # (N,M,3)
    r_norm = np.linalg.norm(r, axis=2)  # (N,M)
    # avoid zero
    r_norm3 = np.where(r_norm == 0, np.inf, r_norm ** 3)

    # cross product dl x r
    cross = np.cross(dl_exp, r)  # (N,M,3)

    # currents shape
    currents = np.array(currents).reshape((1, M, 1))

    coeff = MU0 / (4 * np.pi)
    B = coeff * np.sum(currents * cross / r_norm3[:, :, None], axis=1)
    return B


def discretize_neuron_current(pts, tangents, waveform, current_amplitude=1.0):
    """Turn a neuron curve into segments with current values at a given time.

    pts: (L,3), tangents (L,3)
    waveform: scalar or (L,) multiplier along curve (represents local current magnitude)
    returns segments_start (L-1,3), segments_end (L-1,3), currents (L-1,)
    """
    segments_start = pts[:-1]
    segments_end = pts[1:]
    # local dl length used to scale current amplitude
    dl = segments_end - segments_start
    dl_len = np.linalg.norm(dl, axis=1)
    # use waveform provided along parameterization; map to segment centers
    if np.isscalar(waveform):
        waveform_seg = np.full(dl_len.shape, waveform)
    else:
        waveform = np.asarray(waveform)
        # average adjacent points
        waveform_seg = 0.5 * (waveform[:-1] + waveform[1:])
    currents = current_amplitude * waveform_seg
    return segments_start, segments_end, currents
