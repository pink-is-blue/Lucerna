# LUCERNA Website - Quick Start Guide

## 🚀 Getting Started

### Run the Website
```bash
cd C:\Users\Sankar Surya\Documents\neuro-magnetometry-gnn
npm run dev
```

Open your browser: **http://localhost:3001**

---

## 📖 How to Navigate

### Navigation Controls
- **Previous Button** (Left): Go back to previous step
- **Next Button →** (Right): Advance to next step
- **Step Counter**: Shows your current position (e.g., "5 / 14")
- **Progress Bar**: Visual indicator of progress through the tour

### The Website Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  LUCERNA - Neuro-Magnetometry via NV Center Quantum Sensing    (Header)  │
├──────────────────────────────────────────────┬──────────────────────────┤
│                                              │                          │
│     3D Visualization Canvas                  │   Information Panel      │
│     (70% of width)                           │   (30% of width)         │
│                                              │                          │
│     • Neuron structures                      │   • Step number          │
│     • Quantum systems                        │   • Title                │
│     • Light paths                            │   • Description          │
│     • Detectors                              │   • Key points           │
│     • Graphs & heatmaps                      │   • Technical context    │
│                                              │                          │
├──────────────────────────────────────────────┴──────────────────────────┤
│  [← Previous]        Step-by-Step Interactive Tour        [Next →]      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 The 14 Steps Explained

### **Step 1: Neuron Culture**
- **What you're seeing**: Culture of neurons under a microscope
- **Key concept**: Neurons generate bioelectrical activity that creates local magnetic fields
- **Action**: Click Next to see what happens when we activate this system

### **Step 2: Microwave Activation**
- **What you're seeing**: Microwave waves activating the NV center electrons
- **Key concept**: 23.4 GHz microwave causes spin 0 → ±1 transition
- **Action**: Notice the radiating wave pattern and frequency label

### **Step 3: Spin Visualization**
- **What you're seeing**: Population distribution across spin states
- **Key concept**: Bar chart showing electron populations in different spin states
- **Action**: See how microwave driving affects the distribution

### **Step 4: Neuron Membrane**
- **What you're seeing**: Zoomed in view of neuron membrane with ion channels
- **Key concept**: Na+ ions entering through voltage-gated channels
- **Action**: Notice the ion flow creating depolarization

### **Step 5: Action Potential**
- **What you're seeing**: Action potential propagating down axon with magnetic field
- **Key concept**: Moving charges (current) create magnetic field (Ampere's Law)
- **Action**: See the magnetic field lines surrounding the axon

### **Step 6: NV Center Diamond**
- **What you're seeing**: Diamond lattice with central NV defect
- **Key concept**: Zeeman splitting of electron spin levels by magnetic field
- **Action**: Notice the energy level diagram showing level splitting

### **Step 7: Electron Dynamics**
- **What you're seeing**: Electrons absorbing green photons and emitting red photons
- **Key concept**: Spin-dependent fluorescence enables magnetic field readout
- **Action**: Watch green photons → red photons → electron transitions

### **Step 8: Green Light**
- **What you're seeing**: Incoming green laser exciting NV center
- **Key concept**: 515 nm green photons excite NV center with high cross-section
- **Action**: See green light beam and scattered photons

### **Step 9: Silicon Nitride Waveguide**
- **What you're seeing**: Red photons confined in Si₃N₄ waveguide via TIR
- **Key concept**: Total internal reflection traps light for efficient propagation
- **Action**: Notice light bouncing and staying within the waveguide

### **Step 10: Red Beam Output**
- **What you're seeing**: Red fluorescence beam exiting the waveguide
- **Key concept**: Directed output with high efficiency
- **Action**: See the expanding cone of red light

### **Step 11: Ray Optics Chamber**
- **What you're seeing**: Optical system concentrating the beam
- **Key concept**: Lenses, mirrors, and filters direct light to photodiode
- **Action**: Notice beam focusing and concentration

### **Step 12: Photodiode Detection**
- **What you're seeing**: Silicon APD converting photons to electrical signal
- **Key concept**: Single-photon counting with very low dark current
- **Action**: See the output signal with quantum noise

### **Step 13: Heatmap Result**
- **What you're seeing**: 2D spatial heatmap of magnetic field strength
- **Key concept**: Shows neural activity location and intensity
- **Action**: Colorbar shows field strength from 0-100 pT

### **Step 14: AI Analysis**
- **What you're seeing**: Neural classification and GNN architecture
- **Key concept**: Graph Neural Network decodes neural information
- **Action**: See activity classification (Resting/Active/Spike/Oscillation) and GNN connectivity

---

## 💡 Key Concepts by Step

| Step | Main Physics/Engineering |
|------|---------------------------|
| 1-2 | Quantum state initialization |
| 3 | Quantum coherence visualization |
| 4-5 | Neural signal generation (Ampere's Law) |
| 6 | Zeeman effect & magnetic sensing |
| 7-8 | Quantum-photonic interface |
| 9-10 | Integrated photonics & waveguides |
| 11-12 | Optical detection & electronics |
| 13-14 | Signal processing & ML analysis |

---

## 🎨 Visual Code Guide

### Colors & Their Meanings
- 🟦 **Cyan/Blue** = Detection, sensing, information
- 🟥 **Red** = Final signal, detection output
- 🟩 **Green** = Excitation light, active states
- 🟪 **Purple/Magenta** = Quantum states, NV center
- 🟨 **Yellow/Orange** = Microwave, RF signals
- ⚫ **Black** = Background, neutral
- ⚪ **White** = Labels, text

---

## 🔧 Customizing the Website

### Change Step Descriptions
Edit `src/components/LucernaInteractive.tsx`:
```typescript
const STEPS: StepConfig[] = [
  {
    title: 'Your New Title',
    subtitle: 'Your subtitle',
    description: 'Your detailed description...',
    points: [
      'Key point 1',
      'Key point 2',
    ]
  },
  // ... more steps
]
```

### Change Header Text
Find this in LucernaInteractive.tsx return statement:
```typescript
<h1 className="text-5xl font-bold...">
  LUCERNA
</h1>
```

### Modify Colors
Search for color values like `0xff0000` (red) and replace:
- `0xff0000` = Red
- `0x00ff00` = Green
- `0x0000ff` = Blue
- `0xffff00` = Yellow
- `0x00ffff` = Cyan

---

## 🚀 Pro Tips for Interaction

1. **Take Your Time**: You control the pace - no auto-progression
2. **Read All Details**: Each step has technical context information
3. **Watch the 3D**: The visualizations change completely with each step
4. **Learn the Flow**: Go through once to understand, then revisit favorite steps
5. **Use for Teaching**: This makes an excellent presentation tool
6. **Share the Link**: Send others to http://your-domain/

---

## 📊 Technical Specifications

| Aspect | Details |
|--------|---------|
| **Steps** | 14 interactive visualizations |
| **3D Graphics** | Three.js with WebGL |
| **Update Speed** | 60 FPS smooth rendering |
| **File Size** | ~150 KB (CSS + TypeScript) |
| **Dependencies** | Next.js 14, Three.js, Tailwind CSS |
| **Browser Support** | All modern browsers (Chrome, Firefox, Safari, Edge) |
| **Mobile** | Supports tablets (touch optimization coming soon) |

---

## ❓ Troubleshooting

### Website won't load
```bash
# Kill any process on port 3000/3001
# Then restart
npm run dev
```

### 3D visualization looks wrong
- Ensure WebGL is supported in your browser
- Update GPU drivers
- Try a different browser

### Slow performance
- Close other applications using GPU
- Reduce browser window size temporarily
- Try Hardware Acceleration settings in browser

---

## 📝 Notes

- **Project Name**: Lucerna (Latin: "lamp" or "light source")
- **Focus**: Quantum sensing for neuroscience
- **Technology**: NV Center Quantum Magnetometry + Graph Neural Networks
- **Application**: Non-invasive neural recording with single-cell sensitivity

---

## 🎯 Next Steps

1. ✅ Run the website locally
2. ✅ Navigate through all 14 steps
3. ✅ Customize descriptions and colors as needed
4. ✅ Deploy to production server
5. ✅ Share with team and collaborators

---

**Lucerna Interactive Website**
*Transforming quantum sensing into visual understanding*

v1.0 - February 2026
