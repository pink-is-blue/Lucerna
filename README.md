# Lucerna - Quantum Neural Magnetometry GNN

Interactive visualization platform for Graph Neural Network-based neuro-magnetometry using glide-symmetric topological photonic waveguides.

**Project for Nobel Research Sprint 2025**  
Theme: Translating Quantum Principles into Next-Generation Healthcare

## 🎯 Overview

Lucerna demonstrates a room-temperature chiral quantum interface for real-time neuro-magnetometry by combining:

- **Quantum Physics**: NV-center magnetometry with glide-symmetric topological waveguides
- **Photonics**: Silicon Nitride waveguides with directional photon flow
- **Machine Learning**: Graph Neural Networks with attention mechanisms for signal denoising
- **Healthcare**: Non-invasive neural recording for organoids and living systems

## ✨ Key Features

- **Interactive 3D Visualization**: Real-time 3D graph visualization of NV center networks
- **Signal Denoising**: See how GNN distinguishes neural signals from background noise
- **Attention Mechanisms**: Visualize how message-passing emphasizes informative connections
- **Adjustable Parameters**: Control noise levels, signal intensity, and attention weights
- **Performance Metrics**: Sub-millisecond temporal resolution, single-cell sensitivity

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd neuro-magnetometry-gnn

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the interactive visualization.

## 🏗️ Technology Stack

**Frontend:**
- Next.js 14 (React framework)
- Three.js (3D visualization)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Chart.js (signal analysis)

**Scientific Computing:**
- Graph Neural Networks (PyTorch/TensorFlow)
- Signal processing algorithms
- Quantum sensing principles

## 📊 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Hero.tsx          # Hero section
│   ├── Features.tsx      # Feature highlights
│   ├── Technology.tsx    # Tech stack
│   ├── Team.tsx          # Team information
│   ├── GNNVisualizer3D.tsx    # 3D visualization
│   ├── ControlPanel.tsx  # Interactive controls
│   └── SignalComparison.tsx   # Signal comparison chart
```

## 🔬 Research Background

### The Challenge
Neural action potentials generate ultra-weak magnetic fields (1-100 pT) that are difficult to measure non-invasively. While NV-center magnetometry enables ultra-sensitive sensing, room-temperature directionality has been limited by photon-induced decoherence.

### Our Innovation
We shift chirality from fragile quantum states to **physical architecture** using glide-symmetric topological photonic waveguides, enabling:
- ✓ Room-temperature operation
- ✓ Directional photon collection without cryogenics
- ✓ Single-cell and sub-millisecond temporal resolution
- ✓ Enhanced signal-to-noise ratio

### Key Technologies

**Hardware:**
- Silicon Nitride (Si₃N₄) waveguides
- Isotopically purified ¹²C diamond membranes
- NV center ensembles
- On-chip photodetectors

**Software:**
- Graph Neural Networks with attention mechanisms
- Real-time signal processing
- Computational denoising

## 👥 Team (Lucerna)

- **Harini Rajesh** - 3rd Year MBBS, Stanley Medical College, Chennai
- **Sankar Surya** - Final Year B.E., Vel Tech Rangarajan Dr. Sagunthala R&D Institute
- **Shree Durga K R** - 3rd Year MBBS, Stanley Medical College, Chennai
- **Srihari S** - 3rd Year MBBS, KAP Viswanatham Government Medical College, Trichy

## 📈 Expected Outcomes

- ✓ Room-temperature chiral quantum interface
- ✓ Real-time mapping of neural magnetic activity
- ✓ Single-cell and sub-millisecond temporal resolution
- ✓ Directional optical readout without cryogenics
- ✓ Magnetic sensitivity compatible with neuronal field strengths

## 🎨 Design Inspiration

Inspired by 3Blue1Brown's educational visualization style, combining:
- Beautiful, intuitive 3D graphics
- Interactive parameter exploration
- Clear scientific communication
- Real-time visual feedback

## 📝 License

This project is part of the Nobel Research Sprint 2025.

## 🙏 Acknowledgments

- Nobel Prize Foundation
- Research advisors and mentors
- Three.js and open-source community

---

**Making quantum sensing accessible for healthcare** ✦ Lucerna
