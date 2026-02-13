import numpy as np
from scipy.ndimage import gaussian_filter

def denoise_frequency_shift(df_noisy, spatial_sigma=1.0, temporal_sigma=1.0):
    """
    Denoise ODMR frequency-shift time-series using Gaussian blur.
    Simple proxy for GCNN denoising (full GCNN would use PyTorch+PyG).
    - df_noisy: (N_sensors, T) array
    - spatial_sigma, temporal_sigma: Gaussian filter std
    Returns denoised df same shape
    """
    # Apply 2D Gaussian filtering (spatial + temporal)
    df_denoised = gaussian_filter(df_noisy.astype(float), sigma=(spatial_sigma, temporal_sigma))
    return df_denoised

def graph_smoothing(df, nodes, edges, n_iters=3, alpha=0.1):
    """
    Smooth frequency shifts using graph structure (simple Laplacian smoothing).
    Note: This is a simplified version. Full GCNN would use PyTorch+PyG.
    - df: (N, T) frequency shift array (flat per-sensor per-time)
    - nodes: list of node dicts with time_idx field
    - edges: list of edge dicts
    - n_iters: number of smoothing iterations
    - alpha: smoothing strength
    Returns smoothed df
    """
    N, T = df.shape
    df_smooth = df.copy().astype(float)
    
    # Build adjacency for fast lookup
    adj = [[] for _ in range(len(nodes))]
    for edge in edges:
        s, t_node = edge['source'], edge['target']
        if s < len(adj) and t_node < len(adj):
            w = edge['weight']
            adj[s].append((t_node, w))
            adj[t_node].append((s, w))
    
    # Laplacian smoothing: iteratively average node features with neighbors
    for iteration in range(n_iters):
        df_new = df_smooth.copy()
        for node_idx, neighbors in enumerate(adj):
            if node_idx >= len(nodes) or not neighbors:
                continue
            t_idx = nodes[node_idx]['time_idx']
            if t_idx >= T:
                continue
            
            # average over neighbors weighted by edge weight
            neighbor_sum = 0.0
            neighbor_weight_sum = 0.0
            for neighbor_idx, edge_weight in neighbors:
                if neighbor_idx < len(nodes):
                    neighbor_t_idx = nodes[neighbor_idx]['time_idx']
                    if neighbor_t_idx < T:
                        neighbor_sum += df_smooth[neighbor_idx, neighbor_t_idx] * edge_weight
                        neighbor_weight_sum += edge_weight
            
            if neighbor_weight_sum > 0:
                neighbor_avg = neighbor_sum / neighbor_weight_sum
                df_new[node_idx, t_idx] = (1 - alpha) * df_smooth[node_idx, t_idx] + alpha * neighbor_avg
        
        df_smooth = df_new
    
    return df_smooth
