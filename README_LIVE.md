# Lucerna: 3D Graph Neural Network for Neuro-Magnetometry

**Status: Running locally!**
- Backend: http://127.0.0.1:8000 (FastAPI)
- Frontend: http://localhost:3002 (Next.js) [may vary if ports busy]
- Swagger API docs: http://127.0.0.1:8000/docs

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn server:app --port 8000
```

### Frontend Setup

```bash
npm install --legacy-peer-deps
npm run dev
```

## Architecture

### Backend (Python FastAPI)
- **Neuron Simulation**: Generate parametric 3D neuron curves with action potential propagation
- **Biot-Savart Forward Model**: Compute magnetic field time-series on NV sensor grid
- **ODMR Sensing Layer**: Convert B-field to frequency-shift proxy with noise models
- **Spatiotemporal Graph**: Build node features and edges for neural signal correlations
- **Denoising**: Gaussian filtering (simplified GCNN proxy)

### Frontend (Next.js + React)
- **3D Visualizer**: Three.js interactive NV center network with real-time signal display
- **Control Panel**: Adjust noise, signal intensity, attention weights
- **Signal Comparison**: Before/after denoising charts
- **Hero & Documentation**: Project overview and technical stack

## API Endpoints

### `/simulate` (POST)
Simulate neurons and magnetic fields.
```bash
curl -X POST http://127.0.0.1:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{"n_neurons":50, "sensor_res":16, "n_time":20}'
```

### `/odmr` (POST)
Simulate + ODMR conversion with noise.
```bash
curl -X POST http://127.0.0.1:8000/odmr \
  -H "Content-Type: application/json" \
  -d '{"n_neurons":50, "noise_level":0.2, "signal_scale":1.0}'
```

### `/graph` (POST)
Build spatiotemporal graph.
```bash
curl -X POST http://127.0.0.1:8000/graph \
  -H "Content-Type: application/json" \
  -d '{"n_neurons":40, "spatial_threshold":0.15}'
```

### `/denoise` (POST)
Denoise ODMR data.
```bash
curl -X POST http://127.0.0.1:8000/denoise \
  -H "Content-Type: application/json" \
  -d '{"n_neurons":40, "spatial_sigma":1.5, "temporal_sigma":2.0}'
```

## Features Implemented

 Interactive 3D visualization of NV center network  
 Parametric neuron simulation with moving AP pulses  
 Vectorized Biot-Savart magnetic field calculation  
 ODMR frequency-shift proxy + noise injection  
 Spatiotemporal graph construction with correlation edges  
 Gaussian-based signal denoising  
 Frontend-backend real-time integration  
 Smooth animations and interactive controls  
 Before/after comparison views  

## Technology Stack

**Frontend:**
- Next.js 14, React 18, TypeScript
- Three.js + @react-three/fiber for 3D
- Tailwind CSS, Framer Motion, Chart.js

**Backend:**
- FastAPI + Uvicorn
- NumPy, SciPy for vectorized physics
- Plotly, PyVista for visualization (future)
- PyTorch + PyTorch Geometric for ML (future)

## Running a Demo

1. Start backend: `cd backend && python -m uvicorn server:app --port 8000`
2. Start frontend: `npm run dev`
3. Open browser to http://localhost:3002 (or 3000/3001 if ports busy)
4. Use "Run Simulation" button to fetch backend data and animate the 3D network

## Future Work

- Full GCNN denoiser with PyTorch + PyG
- Image-based interpretation module
- Real-time streaming from simulated sensors
- Machine learning pipeline for neuron localization
- Deployment to cloud platform

---
**Built with  for computational neuroscience.**
