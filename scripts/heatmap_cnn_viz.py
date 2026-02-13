import numpy as np
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.patches import Rectangle, FancyArrowPatch

def make_input_heatmap(n=24, seed=7):
    rng = np.random.default_rng(seed)
    base = rng.normal(0, 0.25, (n, n))
    # Add a few Gaussian peaks to simulate neuron flux hotspots.
    yy, xx = np.mgrid[0:n, 0:n]
    centers = [(6, 8), (16, 6), (14, 17)]
    for (cx, cy, amp, sigma) in [(6, 8, 1.8, 2.0), (16, 6, 1.5, 1.8), (14, 17, 2.2, 2.2)]:
        base += amp * np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * sigma ** 2))
    return base, centers


def make_feature_maps(x, ksize=3):
    # Simple conv-like filters for illustration only.
    kernels = [
        np.array([[1, 0, -1], [1, 0, -1], [1, 0, -1]]),
        np.array([[1, 1, 1], [0, 0, 0], [-1, -1, -1]]),
        np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]]),
        np.array([[1, -2, 1], [-2, 4, -2], [1, -2, 1]]),
        np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]]),
        np.array([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]),
    ]
    pads = ksize // 2
    xp = np.pad(x, pads, mode="reflect")
    feats = []
    for k in kernels:
        out = np.zeros_like(x)
        for i in range(x.shape[0]):
            for j in range(x.shape[1]):
                patch = xp[i:i+ksize, j:j+ksize]
                out[i, j] = np.sum(patch * k)
        feats.append(out)
    return feats


def normalize(z):
    zmin, zmax = np.min(z), np.max(z)
    if zmax - zmin < 1e-9:
        return np.zeros_like(z)
    return (z - zmin) / (zmax - zmin)


def draw_pipeline(ax, left, right, y, label, color="#222"):
    ax.add_patch(FancyArrowPatch((left, y), (right, y), arrowstyle="-|>", mutation_scale=14, linewidth=1.2, color=color))
    ax.text((left + right) / 2, y + 0.04, label, ha="center", va="bottom", fontsize=9, color=color)


def main():
    inp, centers = make_input_heatmap()
    feats = make_feature_maps(inp)
    det = normalize(np.maximum.reduce([normalize(f) for f in feats]))

    # Save output so it can be viewed without an interactive backend.
    output_path = "outputs/heatmap_cnn_viz.png"
    output_svg_path = "outputs/heatmap_cnn_viz.svg"

    fig = plt.figure(figsize=(12.5, 7.2), dpi=130)
    gs = fig.add_gridspec(3, 5, width_ratios=[1.2, 0.25, 1, 1, 1], height_ratios=[1, 1, 1])

    # Input heatmap.
    ax_in = fig.add_subplot(gs[:, 0])
    im_in = ax_in.imshow(inp, cmap="magma")
    ax_in.set_title("Input heatmap\n(neuron flux)")
    ax_in.set_xticks([])
    ax_in.set_yticks([])

    # Kernel overlay for intuition.
    ax_in.add_patch(Rectangle((9.5, 10.5), 3, 3, fill=False, edgecolor="white", linewidth=1.4))
    ax_in.text(11, 10, "3x3 kernel", color="white", ha="center", va="bottom", fontsize=8)

    # Spacer column for arrows.
    ax_arrow = fig.add_subplot(gs[:, 1])
    ax_arrow.axis("off")
    draw_pipeline(ax_arrow, 0.1, 0.9, 0.75, "Conv + ReLU")
    draw_pipeline(ax_arrow, 0.1, 0.9, 0.45, "Stack")
    draw_pipeline(ax_arrow, 0.1, 0.9, 0.15, "Aggregate")

    # Feature maps.
    fm_axes = [
        fig.add_subplot(gs[0, 2]), fig.add_subplot(gs[0, 3]), fig.add_subplot(gs[0, 4]),
        fig.add_subplot(gs[1, 2]), fig.add_subplot(gs[1, 3]), fig.add_subplot(gs[1, 4]),
    ]
    for i, ax in enumerate(fm_axes):
        ax.axis("off")
        if i < len(feats):
            ax.imshow(normalize(feats[i]), cmap="viridis")
            ax.set_title(f"Feature {i+1}", fontsize=9)
        else:
            ax.imshow(np.zeros_like(inp), cmap="gray")
            ax.set_title(f"Feature {i+1}", fontsize=9)

    # Detection heatmap.
    ax_det = fig.add_subplot(gs[2, 2:])
    ax_det.imshow(det, cmap="inferno")
    ax_det.set_title("Detection heatmap\n(high-confidence regions)")
    ax_det.set_xticks([])
    ax_det.set_yticks([])
    # Neuron markers at known hotspot centers.
    for cx, cy in centers:
        ax_det.scatter(cx, cy, s=80, facecolors="none", edgecolors="white", linewidths=1.5)
        ax_det.scatter(cx, cy, s=18, c="white")
    legend_handle = Line2D([], [], marker="o", linestyle="none", markerfacecolor="white",
                           markeredgecolor="white", markersize=6, label="Neurons")
    ax_det.legend(handles=[legend_handle], loc="lower right", frameon=True, fontsize=8)

    # Colorbars.
    cbar_in = fig.colorbar(im_in, ax=ax_in, fraction=0.046, pad=0.03)
    cbar_in.set_label("Flux")

    fig.suptitle("Neuron Detection Using CNN", fontsize=14, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.96])
    fig.savefig(output_path, bbox_inches="tight")
    fig.savefig(output_svg_path, bbox_inches="tight")
    print(f"Saved visualization to: {output_path}")
    print(f"Saved visualization to: {output_svg_path}")
    plt.show()


if __name__ == "__main__":
    main()
