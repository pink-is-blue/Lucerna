import numpy as np

def sample_neuron_curve(length=1.0, n_points=100, rng=None):
    """Generate a 3D parametric curve for a single neuron.

    Returns:
      pts: array (n_points,3)
      tangents: array (n_points,3)
    """
    if rng is None:
        rng = np.random.default_rng()

    # Use a random 3D cubic Bezier-like curve: sample control points
    P0 = rng.uniform([-0.5, -0.5, -0.0], [0.5, 0.5, 0.5])
    P1 = P0 + rng.normal(scale=0.2, size=3)
    P2 = P1 + rng.normal(scale=0.2, size=3)
    P3 = P2 + rng.normal(scale=0.2, size=3)

    t = np.linspace(0.0, 1.0, n_points)
    # cubic bezier - fixed operator precedence
    pts = (
        ((1 - t) ** 3)[:, None] * P0
        + 3 * ((1 - t) ** 2)[:, None] * t[:, None] * P1
        + 3 * (1 - t)[:, None] * (t ** 2)[:, None] * P2
        + (t ** 3)[:, None] * P3
    )
    # approximate tangent by finite difference
    tangents = np.gradient(pts, axis=0)
    norms = np.linalg.norm(tangents, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    tangents = tangents / norms
    # scale curve length
    cur_len = np.sum(np.linalg.norm(np.diff(pts, axis=0), axis=1))
    if cur_len > 0:
        pts = pts * (length / cur_len)
    return pts, tangents


def generate_neuron_population(n_neurons=100, area=(0.0,1.0,0.0,1.0),
                               z_range=(0.0,0.2), mean_length=1.0, rng=None):
    """Create multiple neuron curves placed in the XY area with z offsets.

    area = (xmin,xmax,ymin,ymax)
    Returns list of dicts with pts and tangents
    """
    if rng is None:
        rng = np.random.default_rng()
    neurons = []
    xmin,xmax,ymin,ymax = area
    for i in range(n_neurons):
        # random placement in XY, random z offset
        x0 = rng.uniform(xmin, xmax)
        y0 = rng.uniform(ymin, ymax)
        z0 = rng.uniform(z_range[0], z_range[1])
        length = rng.uniform(mean_length * 0.5, mean_length * 1.5)
        pts, tang = sample_neuron_curve(length=length, n_points=200, rng=rng)
        # translate to random position
        pts = pts + np.array([x0, y0, z0])
        neurons.append({'pts': pts, 'tangents': tang})
    return neurons
