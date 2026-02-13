'use client'

import { motion } from 'framer-motion'

export default function CNNArchitecture() {
  return (
    <section className="py-20 px-4">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            CNN Inverse Model
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Magnetic heatmaps are translated into neuron detections and current-direction
            vector fields using a compact convolutional pipeline.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            className="glass-dark p-8 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Inference Flow</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                <span className="font-semibold text-quantum-cyan">Input:</span> NV-diamond magnetic heatmaps sampled over time.
              </p>
              <p>
                <span className="font-semibold text-quantum-cyan">Feature Extraction:</span> Stacked 3x3 convolutions and ReLU layers capture gradients and polarity changes.
              </p>
              <p>
                <span className="font-semibold text-quantum-cyan">Aggregation:</span> Feature maps are stacked to learn multi-scale spatial signatures.
              </p>
              <p>
                <span className="font-semibold text-quantum-cyan">Outputs:</span> A neuron detection heatmap and a continuous vector field for current direction.
              </p>
              <p className="text-gray-400">
                Training uses regression loss for field magnitude and cosine-similarity loss for flow orientation.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="glass-dark p-6 rounded-xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <svg
              viewBox="0 0 820 320"
              className="w-full h-auto"
              role="img"
              aria-label="CNN inference diagram"
            >
              <defs>
                <linearGradient id="cnnStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="cnnFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f2a44" />
                  <stop offset="100%" stopColor="#0b1224" />
                </linearGradient>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <polygon points="0,0 10,5 0,10" fill="#7c3aed" />
                </marker>
              </defs>

              <g>
                <rect x="30" y="70" width="120" height="180" rx="12" fill="url(#cnnFill)" stroke="url(#cnnStroke)" strokeWidth="2" />
                <rect x="42" y="82" width="120" height="180" rx="12" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
                <rect x="54" y="94" width="120" height="180" rx="12" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.6" />
                <text x="95" y="150" textAnchor="middle" fill="#e5e7eb" fontSize="12">Input</text>
                <text x="95" y="168" textAnchor="middle" fill="#9ca3af" fontSize="11">Heatmap</text>
              </g>

              <g>
                <rect x="190" y="90" width="110" height="140" rx="10" fill="url(#cnnFill)" stroke="url(#cnnStroke)" strokeWidth="2" />
                <text x="245" y="150" textAnchor="middle" fill="#e5e7eb" fontSize="12">Conv</text>
                <text x="245" y="168" textAnchor="middle" fill="#9ca3af" fontSize="10">3x3</text>
              </g>

              <g>
                <rect x="320" y="110" width="90" height="100" rx="10" fill="url(#cnnFill)" stroke="url(#cnnStroke)" strokeWidth="2" />
                <text x="365" y="155" textAnchor="middle" fill="#e5e7eb" fontSize="11">MaxPool</text>
              </g>

              <g>
                <rect x="430" y="95" width="110" height="130" rx="10" fill="url(#cnnFill)" stroke="url(#cnnStroke)" strokeWidth="2" />
                <text x="485" y="148" textAnchor="middle" fill="#e5e7eb" fontSize="12">Conv</text>
                <text x="485" y="166" textAnchor="middle" fill="#9ca3af" fontSize="10">3x3</text>
                <text x="485" y="186" textAnchor="middle" fill="#9ca3af" fontSize="10">ReLU</text>
              </g>

              <g>
                <rect x="560" y="105" width="90" height="110" rx="10" fill="url(#cnnFill)" stroke="url(#cnnStroke)" strokeWidth="2" />
                <text x="605" y="152" textAnchor="middle" fill="#e5e7eb" fontSize="11">FC</text>
              </g>

              <g>
                <line x1="160" y1="160" x2="190" y2="160" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="300" y1="160" x2="320" y2="160" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="410" y1="160" x2="430" y2="160" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="540" y1="160" x2="560" y2="160" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrow)" />
              </g>

              <g>
                <circle cx="720" cy="110" r="10" fill="#7c3aed" />
                <circle cx="720" cy="140" r="10" fill="#6d28d9" />
                <circle cx="720" cy="170" r="10" fill="#5b21b6" />
                <circle cx="720" cy="200" r="10" fill="#4c1d95" />
                <text x="760" y="116" fill="#e5e7eb" fontSize="11">Detection</text>
                <text x="760" y="136" fill="#9ca3af" fontSize="10">Heatmap</text>
                <text x="760" y="174" fill="#e5e7eb" fontSize="11">Vector</text>
                <text x="760" y="192" fill="#9ca3af" fontSize="10">Field</text>
              </g>

              <line x1="650" y1="160" x2="705" y2="155" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrow)" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
