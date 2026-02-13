# 🚀 QUICK START - Lucerna

## Get Running in 2 Minutes

### Step 1: Open Terminal
```bash
cd "C:\Users\Sankar Surya\Documents\neuro-magnetometry-gnn"
```

### Step 2: Install & Run
```bash
npm install
npm run dev
```

### Step 3: Open Browser
Visit: **http://localhost:3000**

## 🎯 What You'll See

1. **Hero Section** - Beautiful intro with project overview
2. **Features** - Key capabilities of the GNN system
3. **3D Visualizer** - Interactive network of NV centers
   - Scroll down to "Interactive GNN Visualizer"
   - Play with sliders on the right:
     - 🔊 Noise Level (increase to add interference)
     - ⚡ Signal Intensity (increase to boost signal)
     - 🧠 Attention Weight (change how GNN weighs connections)
     - 🔄 Auto Rotate (toggle 3D rotation)
4. **Signal Chart** - Before/after denoising comparison
5. **Team Info** - Meet the Lucerna team
6. **Research** - Deep dive into the science

## 📊 Interactive Elements

### 3D Network Visualization
- **Purple/Blue glowing spheres** = NV centers (magnetic sensors)
- **Connecting lines** = Signal correlations
- **Brightness** = Signal strength detected
- **Scale** = Attention importance

### Control Panel
- Adjust noise to see how robust the system is
- Increase signal to see cleaner denoising
- Change attention weights to emphasize different connections

### Signal Chart
- **Cyan line** = Pure neural signal
- **Pink line** = Noisy measurement
- **Purple area** = Cleaned signal from GNN

## 💡 Understanding the Science

**What's happening:**
1. Neural firing produces weak magnetic fields (~1-100 pT)
2. NV centers detect these fields
3. GNN learns which connections matter
4. Output: Clean neural activity maps

**Why it's revolutionary:**
- ✓ Works at room temperature (no liquid nitrogen!)
- ✓ Non-invasive (no electrodes in tissue)
- ✓ Ultra-sensitive (single-cell resolution)
- ✓ Real-time processing

## 🔧 Customization

Want to change something?

- **Colors** → `tailwind.config.ts`
- **Text** → `src/components/*.tsx`
- **3D Network** → `src/components/GNNVisualizer3D.tsx`
- **Animations** → `src/app/globals.css`

## 📂 Key Files

- `src/app/page.tsx` - Main page with all sections
- `src/components/GNNVisualizer3D.tsx` - 3D visualization logic
- `src/components/ControlPanel.tsx` - Interactive sliders
- `src/components/SignalComparison.tsx` - Signal chart
- `tailwind.config.ts` - Design tokens & colors

## ❓ Troubleshooting

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Styles not showing?**
```bash
npm run build
```

**Something broken?**
```bash
rm -r node_modules
npm install
npm run dev
```

## 🌐 Deploy Live

Want to share your website?

### Option 1: Vercel (Easy)
1. Push code to GitHub
2. Go to vercel.com
3. Import repo
4. Done!

### Option 2: Netlify
1. Run `npm run build`
2. Upload `out/` folder
3. Done!

## 📖 Learn More

- **Three.js Docs**: https://threejs.org
- **Next.js Docs**: https://nextjs.org
- **Tailwind CSS**: https://tailwindcss.com
- **GNN Research**: https://arxiv.org (search "graph neural networks")

## 🎨 Want to Customize More?

Check out:
- `SETUP.md` - Detailed setup guide
- `README.md` - Full project documentation
- Component files in `src/components/` - Individual feature code

## 💬 Questions?

The website is self-explanatory! Just:
1. Scroll through each section
2. Play with the 3D visualizer
3. Adjust the sliders
4. Check out the research background

---

**Enjoy exploring Lucerna!** ✦

*Making quantum sensing accessible for healthcare*
