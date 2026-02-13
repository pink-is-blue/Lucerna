'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface CNNVisualizerProps {
  noiseLevel: number
  signalIntensity: number
  featureEmphasis: number
}

const layerCopy = [
  {
    id: 'input',
    title: 'Input Heatmap',
    description: 'NV-diamond magnetic heatmap with noise and spatial gradients.',
    size: { w: 96, h: 140 },
    color: 'from-cyan-500/50 to-blue-500/30'
  },
  {
    id: 'conv1',
    title: 'Conv 3x3',
    description: 'Extracts local polarity changes and directional flux edges.',
    size: { w: 84, h: 120 },
    color: 'from-emerald-500/50 to-emerald-700/30'
  },
  {
    id: 'pool1',
    title: 'MaxPool',
    description: 'Downsamples while keeping strong magnetic hotspots.',
    size: { w: 72, h: 100 },
    color: 'from-indigo-500/40 to-indigo-700/30'
  },
  {
    id: 'conv2',
    title: 'Conv 3x3',
    description: 'Builds higher-order spatial signatures of neuron activity.',
    size: { w: 78, h: 110 },
    color: 'from-emerald-500/50 to-emerald-700/30'
  },
  {
    id: 'fc',
    title: 'Non-Linear + FC',
    description: 'Aggregates spatial evidence into neuron likelihoods.',
    size: { w: 64, h: 90 },
    color: 'from-purple-500/40 to-purple-700/30'
  },
  {
    id: 'output',
    title: 'Output',
    description: 'Neuron detection heatmap with localized activations.',
    size: { w: 64, h: 90 },
    color: 'from-orange-500/40 to-orange-700/30'
  }
]

export default function CNNVisualizer3D({
  noiseLevel,
  signalIntensity,
  featureEmphasis
}: CNNVisualizerProps) {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null)
  const outputCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [activeLayer, setActiveLayer] = useState(layerCopy[0])

  const palette = useMemo(() => {
    return {
      input: ['#06b6d4', '#3b82f6', '#7c3aed', '#ec4899'],
      output: ['#22c55e', '#84cc16', '#facc15', '#f97316']
    }
  }, [])

  useEffect(() => {
    const inputCanvas = inputCanvasRef.current
    const outputCanvas = outputCanvasRef.current
    if (!inputCanvas || !outputCanvas) return

    const inputCtx = inputCanvas.getContext('2d')
    const outputCtx = outputCanvas.getContext('2d')
    if (!inputCtx || !outputCtx) return

    const size = 96
    inputCanvas.width = size
    inputCanvas.height = size
    outputCanvas.width = size
    outputCanvas.height = size

    let time = 0

    const draw = () => {
      time += 0.012 * (0.6 + signalIntensity * 0.4)
      const inputImage = inputCtx.createImageData(size, size)
      const outputImage = outputCtx.createImageData(size, size)

      const sources = [
        { x: 0.2 + 0.1 * Math.cos(time * 0.8), y: 0.3 + 0.15 * Math.sin(time * 0.7), w: 0.22 },
        { x: 0.65 + 0.15 * Math.sin(time * 0.6), y: 0.6 + 0.1 * Math.cos(time * 0.5), w: 0.18 },
        { x: 0.45 + 0.12 * Math.cos(time * 0.9 + 1.1), y: 0.2 + 0.08 * Math.sin(time * 0.9), w: 0.14 }
      ]

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const nx = x / (size - 1)
          const ny = y / (size - 1)
          let value = 0
          sources.forEach((s) => {
            const dx = nx - s.x
            const dy = ny - s.y
            const d = Math.sqrt(dx * dx + dy * dy)
            value += Math.exp(-(d * d) / (s.w * s.w))
          })
          value = value / sources.length
          const noise = (Math.random() - 0.5) * noiseLevel * 0.5
          const signal = Math.max(0, Math.min(1, value + noise))

          const outputSignal = Math.pow(signal, 1.2 + featureEmphasis * 1.6)
          const idx = (y * size + x) * 4

          const inputColor = blendPalette(palette.input, signal)
          inputImage.data[idx] = inputColor[0]
          inputImage.data[idx + 1] = inputColor[1]
          inputImage.data[idx + 2] = inputColor[2]
          inputImage.data[idx + 3] = Math.floor(200 + 55 * signal)

          const outputColor = blendPalette(palette.output, outputSignal)
          outputImage.data[idx] = outputColor[0]
          outputImage.data[idx + 1] = outputColor[1]
          outputImage.data[idx + 2] = outputColor[2]
          outputImage.data[idx + 3] = Math.floor(220 * outputSignal)
        }
      }

      inputCtx.putImageData(inputImage, 0, 0)
      outputCtx.putImageData(outputImage, 0, 0)
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [noiseLevel, signalIntensity, featureEmphasis, palette])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-dark rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Input Heatmap</p>
            <div className="mt-3 rounded-lg overflow-hidden border border-cyan-500/40">
              <canvas ref={inputCanvasRef} className="w-full h-52" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Noise-aware magnetic flux distribution.</p>
          </div>
          <div className="glass-dark rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Output Detection</p>
            <div className="mt-3 rounded-lg overflow-hidden border border-green-400/40">
              <canvas ref={outputCanvasRef} className="w-full h-52" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Neuron likelihoods after CNN inference.</p>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-6">CNN Architecture Flow</h4>
          <div className="flex flex-wrap items-end gap-6">
            {layerCopy.map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer)}
                className="group flex flex-col items-center gap-3 text-left"
              >
                <div
                  className={`relative transition-transform duration-300 ${
                    activeLayer.id === layer.id ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                  style={{ width: layer.size.w, height: layer.size.h }}
                >
                  <div
                    className={`absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-br ${layer.color}`}
                  />
                  <div
                    className={`absolute inset-0 translate-x-2 -translate-y-2 rounded-xl border border-white/10 bg-gradient-to-br ${layer.color} opacity-70`}
                  />
                  <div
                    className={`absolute inset-0 translate-x-4 -translate-y-4 rounded-xl border border-white/10 bg-gradient-to-br ${layer.color} opacity-40`}
                  />
                </div>
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    activeLayer.id === layer.id ? 'text-quantum-cyan' : 'text-gray-400'
                  }`}
                >
                  {layer.title}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Click any block to see what each layer is doing in the inference pipeline.
          </p>
        </div>
      </div>

      <motion.div
        className="glass-dark rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs uppercase tracking-wide text-gray-400">Layer Detail</p>
        <h4 className="text-2xl font-bold text-white mt-3">{activeLayer.title}</h4>
        <p className="text-gray-300 mt-3 leading-relaxed">{activeLayer.description}</p>

        <div className="mt-6 space-y-3 text-sm text-gray-400">
          <p>
            <span className="text-quantum-cyan font-semibold">Live parameters:</span> Noise {(noiseLevel * 100).toFixed(0)}%,
            Signal {(signalIntensity * 100).toFixed(0)}%, Emphasis {(featureEmphasis * 100).toFixed(0)}%.
          </p>
          <p>
            Adjust the sliders to see how the input distribution tightens and how the output detections sharpen.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function blendPalette(palette: string[], t: number) {
  const clamped = Math.max(0, Math.min(1, t))
  const scaled = clamped * (palette.length - 1)
  const idx = Math.floor(scaled)
  const frac = scaled - idx
  const c1 = hexToRgb(palette[idx])
  const c2 = hexToRgb(palette[Math.min(idx + 1, palette.length - 1)])
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * frac),
    Math.round(c1[1] + (c2[1] - c1[1]) * frac),
    Math.round(c1[2] + (c2[2] - c1[2]) * frac)
  ]
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}
