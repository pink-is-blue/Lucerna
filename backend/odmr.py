import numpy as np


def field_to_frequency_shift(Btime, signal_scale=1.0, projection_axis=2):
    """
    Convert B-field vectors to a proxy ODMR frequency shift.
    - Btime: (N_sensors, n_time, 3)
    - signal_scale: multiplicative scale for signal magnitude
    - projection_axis: which axis to project along (default z=2)
    Returns df: (N_sensors, n_time) float array
    """
    # simple proxy: projected component magnitude scaled
    proj = Btime[..., projection_axis]
    df = signal_scale * proj
    return df


def add_noise(df, noise_level=0.1, shot_noise=False, thermal_std=0.0, drift_std=0.0, rng=None):
    """
    Add noise to frequency shifts.
    - noise_level: relative Gaussian noise scale (fraction of max df)
    - shot_noise: if True, add Poisson-like noise (approx via sqrt amplitude)
    - thermal_std: additive gaussian std (absolute)
    - drift_std: low-frequency drift standard deviation applied across time
    - rng: numpy random generator
    Returns noisy df same shape as input
    """
    if rng is None:
        rng = np.random.default_rng()

    df = df.astype(float)
    maxv = max(1.0, np.max(np.abs(df)))
    gauss_std = noise_level * maxv
    noisy = df + rng.normal(scale=gauss_std, size=df.shape)

    if shot_noise:
        # approximate Poisson by adding sqrt-amplitude noise scaled to signal
        shot = rng.normal(scale=np.sqrt(np.abs(df) + 1e-6))
        noisy += shot * (noise_level * 0.5)

    if thermal_std and thermal_std > 0.0:
        noisy += rng.normal(scale=thermal_std, size=df.shape)

    if drift_std and drift_std > 0.0:
        # low-frequency drift: a small random walk per sensor across time
        N, T = df.shape
        drift = rng.normal(scale=drift_std, size=(N,))[:, None] * np.linspace(0.0, 1.0, T)[None, :]
        noisy += drift

    return noisy
