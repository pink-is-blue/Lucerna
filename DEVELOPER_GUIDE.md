# 🎓 Lucerna - Complete Developer Guide

## Welcome to Your Quantum Neural Sensing Visualization!

This is your complete guide to understanding, running, and customizing the Lucerna website.

---

## 📋 Table of Contents

1. [Quick Start (2 min)](#quick-start)
2. [Understanding the Project](#understanding)
3. [Running the Website](#running)
4. [Project Structure](#structure)
5. [How Each Component Works](#components)
6. [Customization Guide](#customization)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start {#quick-start}

### Option 1: Terminal (Fastest)

```powershell
# Copy & paste these 3 lines:
cd "C:\Users\Sankar Surya\Documents\neuro-magnetometry-gnn"
npm install
npm run dev
```

Then open: **http://localhost:3000**

### Option 2: VS Code (Recommended)

1. **Open VS Code**
2. **File → Open Folder** → `Documents\neuro-magnetometry-gnn`
3. **Terminal → New Terminal** (Ctrl + `)
4. **Run:** `npm install && npm run dev`
5. **Open:** http://localhost:3000

---

## 🧠 Understanding the Project {#understanding}

### What is This?

A beautiful, interactive website that visualizes how a Graph Neural Network (GNN) processes magnetic signals from quantum sensors (NV centers) to detect neural activity in real-time.

### Why Is It Cool?

- 🧬 Shows quantum physics in action
- 🎮 Fully interactive 3D visualization
- 📊 Real-time signal processing
- 🏥 Potential medical applications
- ✨ Stunning visual design

### The Science (Simple Version)

1. **NV Centers**: Tiny diamond defects that detect magnetic fields
2. **Neural Activity**: Brain cells generate weak magnetic fields
3. **GNN Processing**: AI network learns which signals are real vs. noise
4. **Result**: Clean brain activity maps without surgery!

### The Website Shows

- 🟣 Purple/blue glowing spheres = NV centers (sensors)
- 🔗 Connecting lines = Signal relationships
- 📊 Chart = Signal before/after cleaning
- 🎚️ Sliders = Experiment with parameters

---

## 🚀 Running the Website {#running}

### First Time Setup

```bash
# 1. Navigate to folder
cd "C:\Users\Sankar Surya\Documents\neuro-magnetometry-gnn"

# 2. Install all packages (first time only!)
npm install
# This downloads ~500MB of dependencies (takes 2-5 minutes)

# 3. Start development server
npm run dev
```

### After Setup (Just Run This)

```bash
npm run dev
```

### Open in Browser

**http://localhost:3000**

### Stop the Server

Press: **Ctrl + C** in terminal

---

## 📂 Project Structure {#structure}

### What's Where?

```
📁 neuro-magnetometry-gnn/
│
├── 📁 src/                          # All code
│   ├── 📁 app/                      # Main application
│   │   ├── page.tsx                 # Main page (everything!)
│   │   ├── layout.tsx               # HTML structure
│   │   └── globals.css              # Styles & animations
│   │
│   └── 📁 components/               # Reusable parts
│       ├── Hero.tsx                 # Welcome section
│       ├── Features.tsx             # What makes it cool
│       ├── Technology.tsx           # Tech stack
│       ├── Team.tsx                 # Meet the team
│       ├── GNNVisualizer3D.tsx      # 3D magic! ⭐
│       ├── ControlPanel.tsx         # Interactive sliders
│       └── SignalComparison.tsx     # Signal chart
│
├── 📄 package.json                  # List of packages
├── 📄 tailwind.config.ts            # Design colors
├── 📄 tsconfig.json                 # TypeScript settings
├── 📄 next.config.js                # Next.js settings
│
├── 📚 README.md                     # Project overview
├── 📚 QUICKSTART.md                 # 2-minute start
├── 📚 SETUP.md                      # Detailed setup
├── 📚 ARCHITECTURE.md               # Technical details
└── 📚 OVERVIEW.md                   # What you got
```

### Key Folders

- **`src/`** - Where all your code lives
- **`src/app/`** - Main app structure
- **`src/components/`** - Individual UI pieces
- **`.next/`** - Generated files (created after build)
- **`node_modules/`** - Downloaded packages (created by npm install)

---

## 🧩 How Each Component Works {#components}

### 1. **Hero.tsx** - The Welcome

```typescript
// What it does:
// - Shows beautiful intro
// - Has main headline
// - Displays key stats
// - Has "Explore" button

// Files: src/components/Hero.tsx
// Styling: Tailwind + Framer Motion
```

**What to edit:**
- Line 15: Main headline
- Line 16: Subtitle
- Line 24: "Explore" button text

---

### 2. **Features.tsx** - The Benefits

```typescript
// What it does:
// - Shows 4 key features
// - Explains how it works
// - Has interactive cards

// Files: src/components/Features.tsx
// Styling: Glass effect, gradient text
```

**What to edit:**
- Line 5-14: Feature definitions
- Change icon emojis: 🟣, 🔗, etc.

---

### 3. **GNNVisualizer3D.tsx** - The Magic ⭐

```typescript
// What it does:
// - Creates 3D scene with Three.js
// - Renders 20 NV center nodes
// - Animates signals
// - Responds to slider changes

// Files: src/components/GNNVisualizer3D.tsx (300+ lines)
// Technology: Three.js, WebGL
```

**How it works:**
1. Creates 3D scene with camera & lights
2. Generates 20 random nodes in space
3. Connects nearby nodes with edges
4. Animates nodes based on signals
5. Updates colors based on noise/intensity
6. Re-renders at 60fps

**What to edit:**
- Line 43: `nodeCount = 20` → Change number of sensors
- Line 63: `< 20` → Change connection distance
- Experiment with physics!

---

### 4. **ControlPanel.tsx** - The Sliders

```typescript
// What it does:
// - Provides 3 sliders
// - Has toggle button
// - Has reset button

// Files: src/components/ControlPanel.tsx
// Styling: Glass effect
```

**What to edit:**
- Lines 30-50: Slider ranges
- Line 55: Label text
- Line 70: Default values

---

### 5. **SignalComparison.tsx** - The Chart

```typescript
// What it does:
// - Draws line chart
// - Shows 3 signals
// - Updates in real-time

// Files: src/components/SignalComparison.tsx
// Technology: Chart.js
```

**What to edit:**
- Lines 60-80: Data series
- Line 90: Chart colors
- Line 110: Axis labels

---

### 6. **page.tsx** - The Main Page

```typescript
// What it does:
// - Imports all components
// - Manages state (sliders)
// - Arranges layout
// - Handles navigation

// Files: src/app/page.tsx
// This is where EVERYTHING comes together!
```

**What to edit:**
- Line 15-30: State setup
- Line 50-200: Section content
- Reorder sections

---

## 🎨 Customization Guide {#customization}

### Change Colors

**File:** `tailwind.config.ts`

```typescript
// Find this section:
colors: {
  quantum: {
    dark: '#0a0e27',        // Change these hex codes
    purple: '#7c3aed',      // Your new colors here
    blue: '#3b82f6',
    cyan: '#06b6d4',
  }
}
```

**Try these colors:**
- Orange: `#ff6b35`
- Green: `#00ff88`
- Red: `#ff004d`
- Gold: `#ffd700`

---

### Change Text

**Files:** Any `src/components/*.tsx`

Just edit the text in JSX:

```typescript
// Change this:
<h1>Lucerna - Quantum Neural Sensing</h1>

// To this:
<h1>My Awesome GNN Project</h1>
```

---

### Change Team Members

**File:** `src/components/Team.tsx`

```typescript
// Find teamMembers array and edit:
const teamMembers = [
  {
    name: 'Your Name',                    // ← Change this
    role: 'Your Title',                   // ← Change this
    institution: 'Your University',       // ← Change this
    contribution: 'What you did'          // ← Change this
  },
  // Add more team members...
]
```

---

### Change Number of 3D Nodes

**File:** `src/components/GNNVisualizer3D.tsx`

```typescript
// Line 43 - Change this:
const nodeCount = 20    // ← Change 20 to 50 or 100

// Warning: Too many = slower performance
```

---

### Change Animation Speed

**File:** `src/app/globals.css`

```css
/* Find this and change durations: */
@keyframes slideIn {
  animation: slideIn 0.6s ease-out;  /* ← Change 0.6s */
}
```

Lower = faster (0.3s), Higher = slower (1.5s)

---

### Change Starting Slider Values

**File:** `src/components/ControlPanel.tsx`

```typescript
// Line 23-26 - Change these:
const [noise, setNoise] = useState(0.3)      // 0-1
const [signal, setSignal] = useState(1.0)    // 0-2
const [attention, setAttention] = useState(0.5)  // 0-1
const [autoRotate, setAutoRotate] = useState(true)
```

---

### Add a New Section

1. **Create new component file:**
   ```bash
   # Create: src/components/NewSection.tsx
   ```

2. **Paste this template:**
   ```typescript
   'use client'
   
   import { motion } from 'framer-motion'
   
   export default function NewSection() {
     return (
       <section className="py-20 px-4">
         <div className="section-container">
           <h2 className="text-4xl font-bold gradient-text">
             My New Section
           </h2>
           <p className="text-gray-300">
             Add your content here!
           </p>
         </div>
       </section>
     )
   }
   ```

3. **Add to main page:**
   ```typescript
   // In src/app/page.tsx, add:
   import NewSection from '@/components/NewSection'
   
   // Then add to JSX:
   <NewSection />
   ```

---

## 🌐 Deployment {#deployment}

### Option 1: Vercel (Easiest)

1. Push code to GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-url>
   git push
   ```

2. Go to **vercel.com**
3. Click "New Project"
4. Import your GitHub repo
5. Click "Deploy"
6. **Done!** Your site is live! 🎉

### Option 2: Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to **netlify.com**
3. Drag & drop the `.next` folder
4. **Done!** 🎉

### Option 3: Run Locally on Your Computer

```bash
# Build
npm run build

# Start
npm start

# Visit http://localhost:3000
```

---

## 🐛 Troubleshooting {#troubleshooting}

### Problem: Port 3000 Already in Use

**Solution 1:** Use different port
```bash
npm run dev -- -p 3001
```

**Solution 2:** Kill existing process
```powershell
netstat -ano | findstr :3000
taskkill /PID <NUMBER> /F
```

### Problem: "Cannot find module"

```bash
# Solution: Reinstall packages
rm -r node_modules package-lock.json
npm install
```

### Problem: Styles not showing

```bash
# Solution: Rebuild
npm run build
npm run dev
```

### Problem: 3D Visualization not rendering

**Check:**
- Browser console for errors (F12)
- Is WebGL supported? Check: https://get.webgl.org/
- Try different browser (Chrome recommended)
- Restart dev server

### Problem: Website is slow

**Solutions:**
- Close other applications
- Clear browser cache (Ctrl+Shift+Del)
- Reduce number of 3D nodes (in GNNVisualizer3D.tsx)
- Use Chrome instead of other browsers

### Problem: Changes not appearing

```bash
# Solution 1: Hard refresh
Ctrl + Shift + R (or Cmd + Shift + R on Mac)

# Solution 2: Restart dev server
# Press Ctrl+C in terminal
# Run: npm run dev again
```

---

## 📚 Useful Resources

| What | URL |
|------|-----|
| **Next.js Docs** | https://nextjs.org/docs |
| **React Docs** | https://react.dev |
| **Three.js Docs** | https://threejs.org/docs |
| **Tailwind CSS** | https://tailwindcss.com/docs |
| **Framer Motion** | https://www.framer.com/motion/ |
| **Chart.js** | https://www.chartjs.org/docs |

---

## 🎯 Common Tasks

### Add a new animation

1. Edit `src/app/globals.css`
2. Add new `@keyframes`
3. Use in component with `animate` class

### Change the main color

1. Edit `tailwind.config.ts`
2. Change `quantum.purple` value
3. Restart dev server (Ctrl+C, then `npm run dev`)

### Add new content

1. Edit component files in `src/components/`
2. Changes appear instantly in browser (hot reload!)

### Fix something broken

1. Check browser console (F12)
2. Look for red error messages
3. Try restarting: Ctrl+C then `npm run dev`

---

## 🎓 Learning Path

### Beginner
- [ ] Run the website
- [ ] Explore all sections
- [ ] Try the sliders
- [ ] Change some text

### Intermediate
- [ ] Change colors
- [ ] Modify component text
- [ ] Add new team members
- [ ] Adjust 3D parameters

### Advanced
- [ ] Create new components
- [ ] Add new sections
- [ ] Integrate real data
- [ ] Deploy to production

---

## ✨ Pro Tips

1. **Live Editing**: Changes appear instantly without restarting!
2. **Browser DevTools** (F12): Inspect HTML, CSS, debug JavaScript
3. **File Organization**: Keep components focused on one job
4. **Git**: Commit often with clear messages
5. **Test Early**: Run `npm run build` before deploying

---

## 🚀 Next Level Ideas

- Add authentication (allow users to login)
- Connect to real sensor data
- Add more 3D visualizations
- Create interactive tutorials
- Add dark/light theme toggle
- Add multiple language support
- Create admin dashboard
- Add social sharing buttons

---

## 📞 Getting Help

1. Check the **README.md** for overview
2. Read **SETUP.md** for detailed help
3. Check **ARCHITECTURE.md** for technical details
4. Search error messages on Google
5. Ask ChatGPT or Claude

---

## 🎉 You're Ready!

```bash
# Run this NOW:
npm run dev
```

Visit: **http://localhost:3000**

Enjoy your beautiful GNN visualization! ✦

---

**Questions?** Check the other .md files in your project folder!

**Happy coding!** 🚀
