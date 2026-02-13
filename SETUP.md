# Lucerna Project Setup Guide

## Complete Setup Instructions

### 1. Open the Project in VS Code

```bash
# Navigate to the project directory
cd "C:\Users\Sankar Surya\Documents\neuro-magnetometry-gnn"

# Open in VS Code
code .
```

### 2. Install Dependencies

Open the terminal in VS Code (Ctrl + `) and run:

```bash
npm install
```

This will install all required packages including:
- Next.js
- React & React-DOM
- Three.js (3D graphics)
- Framer Motion (animations)
- Tailwind CSS (styling)
- Chart.js (signal visualization)

### 3. Run the Development Server

```bash
npm run dev
```

The website will be available at: **http://localhost:3000**

### 4. Build for Production

```bash
npm run build
npm start
```

## 🎨 Website Features

### Hero Section
- Beautiful gradient background with animated elements
- Key metrics display
- Call-to-action button linking to visualizer

### Interactive 3D Visualizer
- **Real-time 3D rendering** of NV center network using Three.js
- **20 sensor nodes** arranged in realistic spatial configuration
- **Dynamic edges** representing signal correlations
- **Color-coded signals** indicating detection strength
- **Auto-rotating camera** for cinematic effect

### Control Panel
- **Noise Level Slider** (0-100%): Control background noise in measurements
- **Signal Intensity Slider** (0-200%): Adjust neural signal strength
- **Attention Weight Slider** (0-100%): Emphasize important GNN connections
- **Auto Rotate Toggle**: Enable/disable automatic camera rotation
- **Reset Button**: Return to default settings

### Signal Visualization Chart
- **Original Signal**: Simulated neural magnetic field
- **Noisy Signal**: Raw measurements with noise
- **GNN Denoised**: Cleaned signal after processing

### Feature Highlights
- Real-time signal processing
- Quantum denoising algorithms
- Spatial correlations
- Attention mechanisms

### Technology Stack Section
- Hardware components (Si₃N₄, diamond, photonics)
- Software solutions (GNN, attention, real-time processing)
- Scientific principles (magnetic sensing, quantum engineering)

### Team Information
- All 4 team members with roles and institutions
- Contributions to the project

### Research Background
- The challenge with current neural sensing
- Our solution using glide symmetry
- Why this technology matters

### Footer
- Project metadata
- Build information

## 🔧 Customization Guide

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  quantum: {
    dark: '#0a0e27',        // Darker background
    darker: '#050812',      // Darkest background
    purple: '#7c3aed',      // Primary accent
    blue: '#3b82f6',        // Secondary accent
    cyan: '#06b6d4',        // Tertiary accent
    accent: '#ec4899',      // Highlight color
  }
}
```

### Adjust Visualization Parameters

Edit `src/components/GNNVisualizer3D.tsx`:

```typescript
const nodeCount = 20  // Number of NV centers
const distance < 20   // Edge connection threshold
```

### Modify Animation Speeds

Edit `src/app/globals.css` and component animations:

```typescript
transition={{ duration: 0.8, delay: 0.1 }}  // Adjust duration
animate={{ ... }}  // Change keyframe values
```

## 📱 Responsive Design

The website is fully responsive:
- **Mobile**: Optimized layout for phones
- **Tablet**: 2-column grid layouts
- **Desktop**: 3-4 column layouts with enhanced animations

## ⚡ Performance Optimization

- Server-side rendering with Next.js
- Lazy loading of components
- Optimized Three.js rendering
- CSS animations instead of JavaScript where possible
- Image optimization

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Find and kill the process (Windows PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
```

### Tailwind Styles Not Applied

```bash
# Rebuild Tailwind
npm run build
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to vercel.com
3. Import the repository
4. Deploy with default settings

### Deploy Locally

```bash
npm run build
npm start
```

## 📚 Project File Structure

```
neuro-magnetometry-gnn/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   └── components/
│       ├── Hero.tsx              # Welcome section
│       ├── Features.tsx          # Key features
│       ├── Technology.tsx        # Tech stack
│       ├── Team.tsx              # Team info
│       ├── GNNVisualizer3D.tsx   # 3D visualization
│       ├── ControlPanel.tsx      # Interactive controls
│       └── SignalComparison.tsx  # Chart visualization
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.js                # Next.js config
├── README.md                     # Project description
└── SETUP.md                      # This file
```

## 🎯 Next Steps

### Add Backend API
Create API routes in `src/app/api/` for:
- Real GNN model inference
- Data persistence
- Analytics

### Integrate Real Data
Replace mock data with:
- Actual sensor readings
- Historical neural recordings
- Experimental results

### Add ML Model
Integrate PyTorch/TensorFlow model:
- Convert to ONNX or TensorFlow.js
- Real-time model inference
- Performance monitoring

### Expand Visualizations
Add new visualization types:
- Heat maps of neural activity
- Temporal evolution graphs
- Frequency domain analysis

## 📞 Support

For issues or questions:
1. Check the README.md
2. Review component comments
3. Check console for error messages
4. Verify all dependencies are installed

## 📝 Notes

- The 3D visualizer runs at 60fps on modern browsers
- WebGL 2.0 support required for visualization
- Tested on Chrome, Firefox, Safari, Edge
- Mobile rendering may be less smooth due to GPU limitations

---

**Happy exploring!** ✦ Lucerna Team
