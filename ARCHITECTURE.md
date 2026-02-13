# 🏗️ Lucerna Architecture & File Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                         │
├─────────────────────────────────────────────────────────────┤
│  HTML / CSS / JavaScript Rendering                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Page (page.tsx)                             │   │
│  │  ├─ Layout (layout.tsx)                              │   │
│  │  ├─ Global Styles (globals.css)                      │   │
│  │  └─ Components                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Component Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Hero          Features       Technology      Team           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │          │  │          │  │          │  │          │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                             │
│  3D Visualizer          Controls         Signal Chart       │
│  ┌─────────────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │ Three.js        │  │ Sliders  │  │ Chart.js        │   │
│  │ WebGL Rendering │  │ Toggles  │  │ Signal Analysis │   │
│  └─────────────────┘  └──────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│                 Styling & Animation                          │
├─────────────────────────────────────────────────────────────┤
│  Tailwind CSS              Framer Motion                    │
│  ├─ Colors                 ├─ Component Animations         │
│  ├─ Layout                 ├─ Gesture Recognition          │
│  ├─ Responsive             ├─ Scroll Triggers              │
│  └─ Utilities              └─ Smooth Transitions           │
└─────────────────────────────────────────────────────────────┘
```

## File Organization Deep Dive

### 📁 Root Configuration Files

```
project-root/
├── package.json              # Dependencies & scripts
│   ├── "dev": "next dev"
│   ├── "build": "next build"
│   └── "start": "next start"
│
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # Node TypeScript config
│
├── tailwind.config.ts        # Design system
│   └── colors: { quantum: { purple, blue, cyan } }
│
├── postcss.config.mjs        # CSS processing pipeline
│   └── tailwindcss → autoprefixer
│
├── next.config.js            # Next.js settings
│
└── .eslintrc.json            # Code quality rules
```

### 📱 Application Layer (`src/app/`)

```
src/app/
├── page.tsx                  # MAIN PAGE - All sections combined
│   ├── Imports all components
│   ├── State management
│   ├── Layout structure
│   └── Navigation
│
├── layout.tsx                # Root layout wrapper
│   ├── Metadata
│   ├── HTML structure
│   └── Body wrapper
│
└── globals.css               # Global styles & animations
    ├── Color variables
    ├── Tailwind directives
    ├── Custom animations
    └── Component classes
```

### 🧩 Components Layer (`src/components/`)

#### 1. **Hero.tsx** - Welcome Section
```typescript
Hero Component
├── Animated background elements
├── Main heading with gradient text
├── Descriptive paragraph
├── Key metrics (3 columns)
├── Call-to-action button
└── Scroll indicator animation
```

#### 2. **Features.tsx** - Key Capabilities
```typescript
Features Component
├── Section heading
├── 4 Feature cards
│   ├── Real-Time Signal Processing
│   ├── Quantum Denoising
│   ├── Spatial Correlations
│   └── Attention Mechanisms
└── "How It Works" explanation box
```

#### 3. **Technology.tsx** - Tech Stack
```typescript
Technology Component
├── Section heading
├── 3 Technology categories
│   ├── Hardware (Si₃N₄, diamond, etc.)
│   ├── Software (GNN, attention, etc.)
│   └── Scientific (sensing, quantum, etc.)
└── Core innovation highlight
```

#### 4. **Team.tsx** - Team Information
```typescript
Team Component
├── Section heading
├── 4 Team member cards
│   └── Name, role, institution, contribution
└── Animated entrance
```

#### 5. **GNNVisualizer3D.tsx** - Main Visualization 🌟
```typescript
GNNVisualizer3D Component
├── THREE.Scene Setup
│   ├── Camera (PerspectiveCamera)
│   ├── Renderer (WebGLRenderer)
│   └── Lighting
│
├── NV Center Nodes (20 total)
│   ├── IcosahedronGeometry
│   ├── MeshStandardMaterial
│   ├── Position in 3D space
│   └── Real-time signal animation
│
├── Signal Edges
│   ├── LineSegments connecting nodes
│   ├── Vertex colors
│   └── Dynamic opacity
│
└── Animation Loop
    ├── 60fps render
    ├── Signal updates
    ├── Camera rotation
    └── Real-time parameter response
```

#### 6. **ControlPanel.tsx** - Interactive Sliders
```typescript
ControlPanel Component
├── Noise Level Slider
│   └── Range: 0-1 (0-100%)
│
├── Signal Intensity Slider
│   └── Range: 0-2 (0-200%)
│
├── Attention Weight Slider
│   └── Range: 0-1 (0-100%)
│
├── Auto Rotate Toggle
│   └── Boolean state
│
└── Reset Button
    └── Return to defaults
```

#### 7. **SignalComparison.tsx** - Chart Visualization
```typescript
SignalComparison Component
├── Chart.js configuration
│
├── 3 Data Series
│   ├── Original Signal (cyan, clean)
│   ├── Noisy Signal (pink, noisy)
│   └── GNN Denoised (purple, processed)
│
├── Real-time data generation
│   └── Based on control parameters
│
└── Responsive chart rendering
    └── Updates on parameter change
```

### 📊 Data Flow

```
Control Panel (User Input)
    ↓
State Updates (React Hooks)
    ├─→ noiseLevel
    ├─→ signalIntensity
    ├─→ attentionWeight
    └─→ autoRotate
    ↓
Component Props Passed
    ├─→ GNNVisualizer3D
    ├─→ SignalComparison
    └─→ Real-time Updates
    ↓
Visual Feedback
    ├─→ 3D Animation Changes
    ├─→ Chart Data Updates
    └─→ Color/Scale Adjustments
```

### 🎨 Styling Architecture

```
Tailwind CSS Pipeline
    ↓
tailwind.config.ts (Design tokens)
    ├─ Colors: quantum palette
    ├─ Animations: custom keyframes
    ├─ Themes: dark mode
    └─ Plugins: utilities
    ↓
Global Styles (globals.css)
    ├─ @tailwind directives
    ├─ Custom CSS classes
    ├─ Animations
    └─ Component utilities
    ↓
Component Classes
    └─ @apply Tailwind utilities
    ↓
PostCSS Processing
    ├─ Tailwind CSS
    ├─ Autoprefixer
    └─ Browser compatibility
    ↓
Final CSS Output
```

### 🎬 Animation System

```
Framer Motion Pipeline
    ↓
Motion Components
    ├─ motion.div
    ├─ motion.button
    └─ motion.h1
    ↓
Animation Variants
    ├─ initial: Starting state
    ├─ animate: Target state
    ├─ exit: Leaving state
    └─ whileHover: Hover state
    ↓
Transitions
    ├─ duration: Animation length
    ├─ delay: Start timing
    ├─ easing: Acceleration curve
    └─ repeat: Loop behavior
    ↓
Viewport Triggers
    ├─ whileInView: Enter screen
    ├─ once: Animate only once
    └─ Custom thresholds
```

## 🔄 Component Hierarchy

```
Page.tsx (Main Container)
│
├─ Header (Navigation)
│
├─ Hero
│   ├─ Animated Background
│   ├─ Heading & Description
│   ├─ Metrics Grid
│   └─ CTA Button
│
├─ Features
│   ├─ Section Title
│   ├─ Feature Grid (4 cards)
│   └─ How It Works Box
│
├─ Technology
│   ├─ Section Title
│   ├─ Tech Grid (3 categories)
│   └─ Innovation Highlight
│
├─ Visualizer Section ⭐ (Main Interactive)
│   ├─ Section Title
│   ├─ Grid Container
│   │   ├─ GNNVisualizer3D (3 cols)
│   │   └─ ControlPanel (1 col)
│   ├─ SignalComparison Chart
│   └─ Info Cards (3 cols)
│
├─ Team
│   ├─ Section Title
│   └─ Team Grid (4 cards)
│
├─ Research Background
│   ├─ Section Title
│   └─ Content Sections (4 cards)
│
└─ Footer
    └─ Credits & Info
```

## 🔌 State Management

```
// Component: Page.tsx
const [noiseLevel, setNoiseLevel] = useState(0.3)
const [signalIntensity, setSignalIntensity] = useState(1.0)
const [attentionWeight, setAttentionWeight] = useState(0.5)
const [autoRotate, setAutoRotate] = useState(true)

// Passed to:
GNNVisualizer3D   ← Uses all 4 states
ControlPanel      ← Updates all 4 states
SignalComparison  ← Uses noise & signal
```

## 📦 Key Dependencies

| Package | Role | Version |
|---------|------|---------|
| **next** | Framework | ^14.0 |
| **react** | UI Library | ^18.2 |
| **three** | 3D Graphics | r128 |
| **@react-three/fiber** | Three.js React | ^8.15 |
| **tailwindcss** | Styling | ^3.3 |
| **framer-motion** | Animations | ^10.16 |
| **chart.js** | Charts | ^4.4 |
| **typescript** | Type Safety | ^5.2 |

## 🚀 Build Pipeline

```
Development
    ↓
npm run dev
    ├─ Next.js dev server
    ├─ Hot reloading
    └─ Source maps
    ↓
http://localhost:3000
    ├─ Browser loads page
    ├─ Components render
    └─ Interactions work

Production
    ↓
npm run build
    ├─ TypeScript compilation
    ├─ Tailwind CSS processing
    ├─ Code optimization
    ├─ Image optimization
    └─ Static generation
    ↓
.next/ directory
    ├─ Optimized bundles
    ├─ Cached assets
    └─ Static pages
    ↓
npm start
    └─ Production server
```

## 🎯 Performance Optimization

```
Code Splitting
    ├─ Automatic route splitting
    ├─ Dynamic imports
    └─ Component lazy loading

Image Optimization
    ├─ Next.js Image component
    ├─ Automatic format
    └─ Responsive sizes

CSS Optimization
    ├─ Unused CSS removal
    ├─ PurgeCSS integration
    └─ Minimal bundle

JavaScript Optimization
    ├─ Tree shaking
    ├─ Dead code elimination
    └─ Code minification
```

---

**This architecture ensures:**
- ✨ Clean, maintainable code
- ⚡ Fast performance
- 🔧 Easy customization
- 📱 Responsive design
- 🎬 Smooth animations

Happy coding! ✦
