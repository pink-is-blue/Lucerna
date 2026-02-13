'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ControlPanelProps {
  onNoiseChange: (value: number) => void
  onSignalChange: (value: number) => void
  onFeatureEmphasisChange: (value: number) => void
}

export default function ControlPanel({
  onNoiseChange,
  onSignalChange,
  onFeatureEmphasisChange
}: ControlPanelProps) {
  const [noise, setNoise] = useState(0.3)
  const [signal, setSignal] = useState(1.0)
  const [featureEmphasis, setFeatureEmphasis] = useState(0.5)

  const handleNoiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setNoise(value)
    onNoiseChange(value)
  }

  const handleSignalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setSignal(value)
    onSignalChange(value)
  }

  const handleEmphasisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setFeatureEmphasis(value)
    onFeatureEmphasisChange(value)
  }

  return (
    <motion.div
      className="glass-dark p-8 rounded-xl space-y-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold gradient-text">Inference Controls</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-200">
            Background Noise Level
          </label>
          <span className="text-lg font-bold text-quantum-purple">
            {(noise * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={noise}
          onChange={handleNoiseChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-quantum-purple"
        />
        <p className="text-xs text-gray-400">
          Controls the amount of noise in the magnetic signal.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-200">
            Signal Intensity
          </label>
          <span className="text-lg font-bold text-quantum-blue">
            {(signal * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={signal}
          onChange={handleSignalChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-quantum-blue"
        />
        <p className="text-xs text-gray-400">
          Adjusts the amplitude of detected magnetic activity.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-200">
            Feature Emphasis
          </label>
          <span className="text-lg font-bold text-quantum-cyan">
            {(featureEmphasis * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={featureEmphasis}
          onChange={handleEmphasisChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-quantum-cyan"
        />
        <p className="text-xs text-gray-400">
          Sharpens neuron detections by amplifying confident regions.
        </p>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          The CNN responds instantly to slider changes. Use this to see how noise suppression and feature emphasis affect neuron localization.
        </p>
      </div>
    </motion.div>
  )
}
