'use client'

import { motion } from 'framer-motion'

const teamMembers = [
  {
    name: 'Harini Rajesh',
    role: '3rd Year MBBS',
    institution: 'Stanley Medical College, Chennai',
    contribution: 'Medical research, biocompatibility analysis'
  },
  {
    name: 'Sankar Surya',
    role: 'Final Year B.E.',
    institution: 'Vel Tech Rangarajan Dr. Sagunthala R&D Institute',
    contribution: 'CNN architecture, website development'
  },
  {
    name: 'Shree Durga K R',
    role: '3rd Year MBBS',
    institution: 'Stanley Medical College, Chennai',
    contribution: 'Clinical applications, neuropathology'
  },
  {
    name: 'Srihari S',
    role: '3rd Year MBBS',
    institution: 'KAP Viswanatham Government Medical College, Trichy',
    contribution: 'Signal processing, data analysis'
  }
]

export default function Team() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent via-quantum-dark/30 to-transparent">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Lucerna Team
          </h2>
          <p className="text-gray-400 text-lg">
            Nobel Research Sprint 2025 - Theme: Translating Quantum Principles into Healthcare
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              className="glass-dark p-6 rounded-lg text-center hover:border-quantum-purple transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-quantum-purple to-quantum-blue mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
              <p className="text-sm text-quantum-cyan mb-1">{member.role}</p>
              <p className="text-xs text-gray-400 mb-3">{member.institution}</p>
              <p className="text-xs text-gray-500 italic">{member.contribution}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
