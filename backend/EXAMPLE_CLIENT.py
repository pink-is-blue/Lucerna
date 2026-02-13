import requests
import numpy as np

url = 'http://localhost:8000/simulate'
req = {
    'n_neurons': 50,
    'area': [0.0, 1.0, 0.0, 1.0],
    'mean_length': 0.4,
    'n_time': 20,
    't_max': 0.01,
    'sensor_res': 32,
}
resp = requests.post(url, json=req)
resp.raise_for_status()
data = resp.json()
xs = np.array(data['xs'])
ys = np.array(data['ys'])
times = np.array(data['times'])
Bshape = tuple(data['Bshape'])
Bflat = np.array(data['B'])
B = Bflat.reshape(Bshape)
print('B shape:', B.shape)
# Example: magnitude at time index 0
mag0 = np.linalg.norm(B[:,0,:], axis=1)
print('max magnitude t0', mag0.max())
