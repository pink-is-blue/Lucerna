import numpy as np

def build_spatiotemporal_graph(df, xs, ys, times, spatial_threshold=0.15, temporal_threshold=1):
    """
    Build a spatiotemporal graph from ODMR frequency-shift time-series.
    - df: (N_sensors, T) frequency shift array
    - xs, ys: sensor grid coordinates
    - times: time points
    - Returns: nodes dict and edges list
    """
    N, T = df.shape
    n_xy = len(xs)
    
    # Node features: [freq_shift, temporal_deriv, spatial_mean, time_idx, x, y]
    nodes = []
    for t_idx in range(T):
        for i in range(N):
            x_idx, y_idx = i // n_xy, i % n_xy
            x, y = xs[x_idx], ys[y_idx]
            freq = df[i, t_idx]
            
            # temporal derivative
            if t_idx > 0:
                deriv = df[i, t_idx] - df[i, t_idx-1]
            else:
                deriv = 0.0
            
            # local spatial mean
            spatial_mean = np.mean(df[max(0, i-n_xy):min(N, i+n_xy), t_idx])
            
            nodes.append({
                'id': len(nodes),
                'freq': float(freq),
                'deriv': float(deriv),
                'spatial_mean': float(spatial_mean),
                'time_idx': t_idx,
                'x': float(x),
                'y': float(y),
                'features': [freq, deriv, spatial_mean, float(t_idx), x, y]
            })
    
    # Edges: connect nearby nodes in space within same/adjacent time windows
    edges = []
    for n1 in nodes:
        for n2 in nodes:
            if n1['id'] >= n2['id']:
                continue
            
            # spatial distance
            dx = n1['x'] - n2['x']
            dy = n1['y'] - n2['y']
            spatial_dist = np.sqrt(dx*dx + dy*dy)
            
            # temporal distance
            time_diff = abs(n1['time_idx'] - n2['time_idx'])
            
            # connect if spatially close AND temporally close
            if spatial_dist < spatial_threshold and time_diff <= temporal_threshold:
                weight = 1.0 / (spatial_dist + 0.01) * np.exp(-time_diff)
                edges.append({
                    'source': n1['id'],
                    'target': n2['id'],
                    'weight': float(weight),
                    'spatial_dist': float(spatial_dist),
                    'time_diff': int(time_diff)
                })
    
    return nodes, edges
