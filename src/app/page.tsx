'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Technology from '@/components/Technology'
import Team from '@/components/Team'
import ControlPanel from '@/components/ControlPanel'
import CNNVisualizer3D from '@/components/GNNVisualizer3D'
import SignalComparison from '@/components/SignalComparison'

export default function Home() {
  const [noiseLevel, setNoiseLevel] = useState(0.3)
  const [signalIntensity, setSignalIntensity] = useState(1.0)
  const [featureEmphasis, setFeatureEmphasis] = useState(0.5)

  return (
    <main className="min-h-screen text-white">
      <Hero />

      <section id="visualizer" className="py-20 px-4">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              CNN Inference Playground
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Explore CNN layers, evolving heatmaps, and neuron detection outputs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 items-start">
            <ControlPanel
              onNoiseChange={setNoiseLevel}
              onSignalChange={setSignalIntensity}
              onFeatureEmphasisChange={setFeatureEmphasis}
            />

            <div className="space-y-8">
              <div className="glass-dark p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">CNN Inference View</h3>
                    <p className="text-sm text-gray-400">Input heatmap and neuron detection output</p>
                  </div>
                  <div className="text-xs text-gray-400">Noise: {(noiseLevel * 100).toFixed(0)}%</div>
                </div>
                <CNNVisualizer3D
                  noiseLevel={noiseLevel}
                  signalIntensity={signalIntensity}
                  featureEmphasis={featureEmphasis}
                />
              </div>

              <SignalComparison noiseLevel={noiseLevel} signalIntensity={signalIntensity} />
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Technology />
      <Team />
    </main>
  )
}
