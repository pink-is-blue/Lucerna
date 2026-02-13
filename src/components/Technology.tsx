'use client'

import { motion } from 'framer-motion'

const technologies = [
  {
    category: 'Hardware',
    items: [
      'Silicon Nitride Waveguides',
      'Diamond NV Centers',
      'Glide-Symmetric Photonics',
      'On-chip Photodetectors'
    ]
  },
  {
    category: 'Software',
    items: [
      'Convolutional Neural Networks',
      'Vector Field Regression',
      'Real-time Signal Processing',
      'Inverse-Model Denoising'
    ]
  },
  {
    category: 'Scientific',
    items: [
      'Magnetic Field Sensing',
      'Quantum State Engineering',
      'Topological Photonics',
      'Neural Recording'
    ]
  }
]

export default function Technology() {
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
            Technology Stack
          </h2>
          <p className="text-gray-400 text-lg">
            Combining quantum photonics with machine learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech, idx) => (
            <motion.div
              key={idx}
              className="glass-dark p-8 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h3 className="text-xl font-bold text-quantum-purple mb-6">
                {tech.category}
              </h3>
              <ul className="space-y-4">
                {tech.items.map((item, itemIdx) => (
                  <motion.li
                    key={itemIdx}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (idx * 0.1) + (itemIdx * 0.05) }}
                  >
                    <span className="text-quantum-cyan font-bold mt-1">→</span>
                    <span className="text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Innovation highlight */}
        <motion.div
          className="mt-16 p-8 glass-dark rounded-xl border-l-4 border-quantum-cyan"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Core Innovation</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            We shift chirality from fragile quantum states to physical architecture. By using glide-symmetric topological photonic waveguides, we enforce unidirectional photon flow even under thermal noise or substantial disorder.
          </p>
          <p className="text-gray-400 italic">
            Structural chirality replaces temperature-sensitive quantum chirality, making directionality a feature of the engineered photonic landscape.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
