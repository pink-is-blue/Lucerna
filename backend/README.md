Lucerna backend - neuron & magnetic field simulation

Quick start

1. Create Python environment and install dependencies:

```bash
python -m venv .venv
.\.venv\Scripts\activate   # Windows PowerShell
pip install -r requirements.txt
```

2. Run the API server:

```bash
uvicorn server:app --reload --port 8000
```

3. Example request (generate simulation):

```bash
curl -X POST "http://localhost:8000/simulate" -H "Content-Type: application/json" -d "{\"n_neurons\":100, \"area\": [0.0, 1.0, 0.0, 1.0], \"n_time\":50}" | jq
```

What this provides

- `/simulate` (POST): generate neurons, currents, and B-field time series on a 2D sensing plane. Returns JSON with sensor grid coords and B(t) arrays (x,y,t,3).

Design notes

- This backend focuses on conceptual correctness and interpretability rather than biological fidelity.
- All modules are lightweight numpy implementations and are modular for later replacement with PyTorch/PyG models.

Next steps

- Add ODMR conversion, noise model, and graph construction endpoints
- Add a GCNN denoising prototype using PyTorch Geometric
- Integrate with the Next.js frontend via fetch calls
