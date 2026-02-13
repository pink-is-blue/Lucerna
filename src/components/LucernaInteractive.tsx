'use client'

import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { BufferGeometry, Vector3 } from 'three'

interface StepConfig {
  title: string
  description: string
  subtitle: string
  points?: string[]
}

const STEPS: StepConfig[] = [
  {
    title: 'Neuron Culture',
    subtitle: 'Under Microscope',
    description: 'Culture of neurons visible through microscope. These neurons generate action potentials that create local magnetic fields.',
    points: [
      'Cell body with dendrites',
      'Axon terminals',
      'Synaptic connections',
      'Magnetic field generation'
    ]
  },
  {
    title: 'Microwave Activation',
    subtitle: 'Spin Transition (0 → ±1)',
    description: 'Microwave pulse applied to NV center electrons, causing spin state transition from spin-0 ground state to spin-±1 excited states.',
    points: [
      'GHz frequency microwave',
      'Spin-0 → Spin-±1 transition',
      'Electron spin polarization',
      'ODMR resonance'
    ]
  },
  {
    title: 'Spin State Visualization',
    subtitle: 'Population Distribution Graph',
    description: 'Graph showing spin populations across m_s states. Microwave induces coherent superposition states.',
    points: [
      'Spin-0 ground state baseline',
      'Spin-±1 excited populations',
      'Coherence visualization',
      'Population dynamics'
    ]
  },
  {
    title: 'Neuron Membrane',
    subtitle: 'Ion Channel Activity',
    description: 'Zoom into neuron membrane showing Na+ ions entering through channels, generating action potential.',
    points: [
      'Voltage-gated Na+ channels',
      'Ion influx creates depolarization',
      'Membrane potential change',
      'Action potential initiation'
    ]
  },
  {
    title: 'Action Potential',
    subtitle: 'Ampere\'s Law & Magnetic Field',
    description: 'Zoom out to show action potential propagating along axon. Moving charges create magnetic field via Ampere\'s Law (∇×B = μ₀J).',
    points: [
      'Axon with departing action potential',
      'Current flow (J)',
      'Magnetic field generation',
      'Field magnitude ~10-100 pT'
    ]
  },
  {
    title: 'NV Center Diamond',
    subtitle: 'Zeeman Splitting',
    description: 'Zoom into NV center diamond lattice. External magnetic field causes Zeeman splitting of electron spin levels.',
    points: [
      'Diamond crystal lattice',
      'NV center atomic structure',
      'Electron spin energy levels',
      'Zeeman splitting (ΔE = γB)'
    ]
  },
  {
    title: 'Electron Dynamics',
    subtitle: 'Photon Emissions',
    description: 'Electrons absorb green photons, transition between states, and emit red photons (23.4 GHz resonance).',
    points: [
      'Green photon absorption',
      'Spin-dependent transition',
      'Energy non-radiative decay',
      'Red photon emission'
    ]
  },
  {
    title: 'Green Light',
    subtitle: 'Excitation & Interception',
    description: 'Incoming green light excites NV center. Part of green light is transmitted, part scattered.',
    points: [
      'Incident green photons',
      'Absorption cross-section',
      'Excited state lifetime',
      'Light-matter interaction'
    ]
  },
  {
    title: 'Silicon Nitride Waveguide',
    subtitle: 'Total Internal Reflection',
    description: 'Red photons enter silicon nitride waveguide with high refractive index. Total internal reflection confines light.',
    points: [
      'Si₃N₄ waveguide core',
      'Critical angle θ_c',
      'Low-loss confinement',
      'Single-mode propagation'
    ]
  },
  {
    title: 'Red Beam Output',
    subtitle: 'Optical Extraction',
    description: 'Red fluorescence beam emerges from waveguide with high efficiency and directional propagation.',
    points: [
      'Waveguide output coupler',
      'Beam direction & intensity',
      'Photon rate (MHz)',
      'Signal-to-noise ratio'
    ]
  },
  {
    title: 'Ray Optics Chamber',
    subtitle: 'Beam Concentration',
    description: 'Ray optics system with lenses and mirrors concentrates the diffuse red beam onto photodiode.',
    points: [
      'Objective lens (4.0 NA)',
      'Dichroic mirrors',
      'Optical filtering',
      'Beam focusing'
    ]
  },
  {
    title: 'Photodiode Detection',
    subtitle: 'Signal Conversion',
    description: 'Red photons strike silicon photodiode, converting photon rate into electrical signal proportional to magnetic field.',
    points: [
      'Avalanche photodiode (APD)',
      'Single-photon counting',
      'Quantum efficiency',
      'Dark count rate <100 cps'
    ]
  },
  {
    title: 'Heatmap Result',
    subtitle: 'Spatial Magnetic Field Distribution',
    description: 'Heatmap shows 2D spatial projection of magnetic field strength above neuron culture. Reveals current flow patterns.',
    points: [
      'Spatial resolution <1 μm',
      'Field strength (pT)', 
      'Temporal dynamics',
      'Neural hotspots identified'
    ]
  },
  {
    title: 'AI Analysis',
    subtitle: 'Neural Pattern Recognition',
    description: 'Convolutional neural network (CNN) analyzes magnetic heatmaps to detect neurons and infer current direction fields.',
    points: [
      '3x3 convolution feature extraction',
      'Neuron detection heatmaps',
      'Vector-field direction inference',
      'Real-time inverse mapping'
    ]
  }
]

export default function LucernaInteractive() {
  const [currentStep, setCurrentStep] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const contentGroupRef = useRef<THREE.Group | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const stepAnimatorRef = useRef<((time: number) => void) | null>(null)

  const step = STEPS[currentStep]

  const renderScene = () => {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current
    if (!renderer || !scene || !camera) return
    renderer.render(scene, camera)
  }

  const clearGroup = (group: THREE.Group) => {
    group.children.forEach((child) => {
      child.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(material)) {
          material.forEach((mat) => mat.dispose())
        } else if (material) {
          material.dispose()
        }
      })
    })
    while (group.children.length > 0) {
      group.remove(group.children[0])
    }
  }

  const renderStepToGroup = (stepIndex: number, group: THREE.Group) => {
    let animator: ((time: number) => void) | null = null
    if (stepIndex === 0) {
      animator = renderNeuronCulture(group, renderScene)
    } else if (stepIndex === 1) {
      animator = renderMicrowaveActivation(group, renderScene)
    } else if (stepIndex === 2) {
      animator = renderSpinGraph(group, renderScene)
    } else if (stepIndex === 3) {
      animator = renderNeuronMembrane(group, renderScene)
    } else if (stepIndex === 4) {
      animator = renderActionPotential(group, renderScene)
    } else if (stepIndex === 5) {
      animator = renderNVCenter(group, renderScene)
    } else if (stepIndex === 6) {
      animator = renderPhotonDynamics(group, renderScene)
    } else if (stepIndex === 7) {
      animator = renderGreenLight(group, renderScene)
    } else if (stepIndex === 8) {
      animator = renderWaveguide(group, renderScene)
    } else if (stepIndex === 9) {
      animator = renderRedBeam(group, renderScene)
    } else if (stepIndex === 10) {
      animator = renderOptics(group, renderScene)
    } else if (stepIndex === 11) {
      animator = renderPhotodiode(group, renderScene)
    } else if (stepIndex === 12) {
      animator = renderHeatmap(group, renderScene)
    } else if (stepIndex === 13) {
      animator = renderAIGraph(group, renderScene)
    }
    stepAnimatorRef.current = animator
  }

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e27)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 8)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 10)
    scene.add(pointLight)

    const contentGroup = new THREE.Group()
    scene.add(contentGroup)
    contentGroupRef.current = contentGroup

    renderStepToGroup(currentStep, contentGroup)
    renderScene()

    const animate = (time: number) => {
      animationIdRef.current = requestAnimationFrame(animate)
      if (stepAnimatorRef.current) {
        stepAnimatorRef.current(time)
      }
      renderScene()
    }

    animationIdRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.render(scene, camera)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (contentGroupRef.current) {
        clearGroup(contentGroupRef.current)
      }
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    const group = contentGroupRef.current
    if (!group) return
    clearGroup(group)
    renderStepToGroup(currentStep, group)
    renderScene()
  }, [currentStep])

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-black flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-lg border-b border-cyan-500/30 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            LUCERNA
          </h1>
          <p className="text-gray-400 text-lg">Neuro-Magnetometry via NV Center Quantum Sensing</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3D Visualization */}
        <div
          ref={containerRef}
          className="flex-1 relative"
          style={{ height: '100%' }}
        />

        {/* Info Panel */}
        <div className="w-96 bg-black/90 backdrop-blur-xl border-l border-purple-500/30 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Step Counter */}
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-cyan-400">{currentStep + 1}</span>
                <span className="text-gray-400">/ {STEPS.length}</span>
              </div>
              <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Title and Description */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{step.title}</h2>
              <p className="text-cyan-400 text-sm font-semibold mb-3">{step.subtitle}</p>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </div>

            {/* Key Points */}
            {step.points && (
              <div>
                <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {step.points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-400">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Info */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-xs font-semibold text-cyan-300 mb-2 uppercase">Technical Context</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {currentStep === 0 && 'Neurons generate bioelectrical activity that produces local magnetic fields detectable by sensitive NV center magnetometers.'}
                {currentStep === 1 && 'Microwave pulses at the ODMR resonance frequency (~23.4 GHz for 0.1 T field) control electron spin states.'}
                {currentStep === 2 && 'Population distribution across spin states reveals quantum coherence maintained by the NV center.'}
                {currentStep === 3 && 'Ion channels are nanoscale structures that permit selective ion flow, fundamental to neural signaling.'}
                {currentStep === 4 && 'Moving charges create magnetic fields following Ampere\'s law: ∇×B = μ₀J. Action potentials in axons are our signal source.'}
                {currentStep === 5 && 'Zeeman effect splits energy levels proportionally to B field. NV center spin larmor frequency: ω = γB where γ = 2.88 MHz/mT.'}
                {currentStep === 6 && 'Green laser excites NV to emission center. Spin-dependent fluorescence enables magnetic field readout.'}
                {currentStep === 7 && 'Green photons (515 nm) are absorbed by NV center with high cross-section (~100 Å²). Photon rate ~1 MHz at saturation.'}
                {currentStep === 8 && 'Silicon nitride has refractive index ~2.0, enabling total internal reflection at critical angle ~30° for on-chip light guiding.'}
                {currentStep === 9 && 'Red fluorescence (637 nm) at 23.4 GHz sidebands carries magnetic field information with quantum efficiency >60%.'}
                {currentStep === 10 && 'Optical system with NA ≥ 0.9 collects light efficiently. Dichroic & bandpass filters isolate fluorescence from excitation.'}
                {currentStep === 11 && 'APD with <100 cps dark count and single-photon sensitivity converts photons to voltage pulses counted in real-time.'}
                {currentStep === 12 && 'Heatmap created by raster scanning revealing 2D spatial distribution of neural magnetic activity with <1 μm spatial resolution.'}
                {currentStep === 13 && 'Convolutional neural networks analyze magnetic heatmaps to detect neuron sources and infer current direction fields.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-black/80 backdrop-blur-lg border-t border-cyan-500/30 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            ← Previous
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">Step by Step Interactive Tour</p>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === STEPS.length - 1}
            className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center gap-2"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

// ============= VISUALIZATION FUNCTIONS =============

function renderNeuronCulture(scene: THREE.Object3D, render: () => void) {
  const somas: THREE.Mesh[] = []

  // Microscope frame
  const frameGeo = new THREE.BoxGeometry(7.5, 5.2, 0.2)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b })
  const frame = new THREE.Mesh(frameGeo, frameMat)
  frame.position.z = -2
  scene.add(frame)

  // Larger neuron culture
  for (let i = 0; i < 10; i++) {
    const x = (Math.random() - 0.5) * 6
    const y = (Math.random() - 0.5) * 4
    const somaGeo = new THREE.SphereGeometry(0.45, 12, 12)
    const somaMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.58 + Math.random() * 0.15, 0.7, 0.5),
      emissive: new THREE.Color().setHSL(0.58 + Math.random() * 0.15, 0.7, 0.3),
      emissiveIntensity: 0.4
    })
    const soma = new THREE.Mesh(somaGeo, somaMat)
    soma.position.set(x, y, -1.6)
    scene.add(soma)
    somas.push(soma)

    // Dendrites as light lines
    const branches = 3
    for (let j = 0; j < branches; j++) {
      const angle = (j / branches) * Math.PI * 2 + Math.random() * 0.4
      const endX = x + Math.cos(angle) * (1.2 + Math.random() * 0.6)
      const endY = y + Math.sin(angle) * (1.2 + Math.random() * 0.6)
      const points = [new Vector3(x, y, -1.6), new Vector3(endX, endY, -1.6)]
      const lineGeo = new BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 })
      const line = new THREE.Line(lineGeo, lineMat)
      scene.add(line)
    }
  }

  // Main axon path with current movers
  const axonPoints = [
    new Vector3(-3.5, -1.5, -1.2),
    new Vector3(-1, -0.5, -1.1),
    new Vector3(1.2, 0.3, -1.0),
    new Vector3(3.6, 1.6, -0.9)
  ]
  const axonCurve = new THREE.CatmullRomCurve3(axonPoints)
  const axonGeo = new THREE.TubeGeometry(axonCurve, 60, 0.08, 6, false)
  const axonMat = new THREE.MeshStandardMaterial({ color: 0xff66cc, emissive: 0x220022, roughness: 0.7 })
  const axon = new THREE.Mesh(axonGeo, axonMat)
  scene.add(axon)

  const movers: THREE.Mesh[] = []
  const moverGeo = new THREE.SphereGeometry(0.12, 8, 8)
  const moverMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x006666, roughness: 0.5 })
  for (let i = 0; i < 10; i++) {
    const mover = new THREE.Mesh(moverGeo, moverMat)
    scene.add(mover)
    movers.push(mover)
  }

  render()

  return (time: number) => {
    const t = time * 0.001
    somas.forEach((soma, idx) => {
      const pulse = 1 + Math.sin(t * 2 + idx) * 0.04
      soma.scale.set(pulse, pulse, pulse)
    })

    movers.forEach((mover, idx) => {
      const u = (t * 0.15 + idx / movers.length) % 1
      const pos = axonCurve.getPointAt(u)
      mover.position.copy(pos)
    })
  }
}

function renderMicrowaveActivation(scene: THREE.Object3D, render: () => void) {
  // NV center diamond
  const diamondGeo = new THREE.OctahedronGeometry(0.6, 3)
  const diamondMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff0088,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.2
  })
  const diamond = new THREE.Mesh(diamondGeo, diamondMat)
  scene.add(diamond)

  // Microwave waves emanating from all directions
  const waveCount = 6
  const rings: THREE.Mesh[] = []
  for (let i = 0; i < waveCount; i++) {
    const angle = (i / waveCount) * Math.PI * 2
    const waveGroup = new THREE.Group()

    for (let j = 0; j < 2; j++) {
      const ringGeo = new THREE.TorusGeometry(2 + j * 0.8, 0.1, 8, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.3 - j * 0.08
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.order = 'YXZ'
      ring.rotation.y = angle
      ring.rotation.x = Math.PI / 4
      waveGroup.add(ring)
      rings.push(ring)
    }

    scene.add(waveGroup)
  }

  // Frequency label
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.font = 'bold 28px Arial'
  ctx.fillStyle = '#ffaa00'
  ctx.textAlign = 'center'
  ctx.fillText('23.4 GHz', 128, 44)
  const texture = new THREE.CanvasTexture(canvas)
  const spriteMat = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(spriteMat)
  sprite.position.y = -3
  sprite.scale.set(3, 0.8, 1)
  scene.add(sprite)

  render()

  return (time: number) => {
    const t = time * 0.001
    diamond.rotation.x = t * 0.6
    diamond.rotation.y = t * 0.8
    const pulse = 0.9 + Math.sin(t * 4) * 0.08
    diamond.scale.set(pulse, pulse, pulse)
    rings.forEach((ring, idx) => {
      const mat = ring.material as THREE.MeshBasicMaterial
      mat.opacity = 0.15 + 0.15 * (0.5 + Math.sin(t * 3 + idx))
      ring.scale.set(1 + Math.sin(t * 2 + idx) * 0.1, 1 + Math.sin(t * 2 + idx) * 0.1, 1)
    })
  }
}

function renderSpinGraph(scene: THREE.Object3D, render: () => void) {
  // Background grid
  const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
  gridHelper.position.z = -2
  scene.add(gridHelper)

  // Axis lines
  const xAxis = new THREE.Line(
    new BufferGeometry().setFromPoints([new Vector3(-4, 0, 0), new Vector3(4, 0, 0)]),
    new THREE.LineBasicMaterial({ color: 0xff4444 })
  )
  const yAxis = new THREE.Line(
    new BufferGeometry().setFromPoints([new Vector3(0, -3, 0), new Vector3(0, 3, 0)]),
    new THREE.LineBasicMaterial({ color: 0x44ff44 })
  )
  scene.add(xAxis)
  scene.add(yAxis)

  // Spin state populations (bar chart style)
  const states = [
    { label: 'ms = -1', x: -2, color: 0x0088ff, height: 0.8 },
    { label: 'ms = 0', x: 0, color: 0x00ff88, height: 0.5 },
    { label: 'ms = +1', x: 2, color: 0xff0088, height: 0.8 }
  ]

  const bars: THREE.Mesh[] = []
  states.forEach(state => {
    const barGeo = new THREE.BoxGeometry(0.6, state.height * 2, 0.2)
    const barMat = new THREE.MeshStandardMaterial({
      color: state.color,
      emissive: state.color,
      emissiveIntensity: 0.4
    })
    const bar = new THREE.Mesh(barGeo, barMat)
    bar.position.set(state.x, state.height, 0)
    scene.add(bar)
    bars.push(bar)
  })

  // Oscillation curve superimposed
  const points = []
  for (let t = 0; t < 100; t++) {
    const x = -3 + (t / 100) * 6
    const y = Math.sin(t / 15) * 0.5 + 0.5
    points.push(new Vector3(x, y, 0.1))
  }
  const curveGeo = new BufferGeometry().setFromPoints(points)
  const curveMat = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 })
  const curve = new THREE.Line(curveGeo, curveMat)
  scene.add(curve)

  render()

  return (time: number) => {
    const t = time * 0.001
    bars.forEach((bar, idx) => {
      const pulse = 0.9 + Math.sin(t * 2 + idx) * 0.15
      bar.scale.y = pulse
      bar.position.y = (bar.geometry as THREE.BoxGeometry).parameters.height * 0.5 * pulse
    })
    curve.position.y = Math.sin(t * 1.5) * 0.15
  }
}

function renderNeuronMembrane(scene: THREE.Object3D, render: () => void) {
  // Membrane bilayer (large plane)
  const membraneGeo = new THREE.PlaneGeometry(6, 4)
  const membraneMat = new THREE.MeshStandardMaterial({
    color: 0x444488,
    metalness: 0.3
  })
  const membrane = new THREE.Mesh(membraneGeo, membraneMat)
  membrane.position.z = -1
  scene.add(membrane)

  // Ion channels (fewer)
  for (let i = 0; i < 3; i++) {
    const channelX = -1.5 + i * 1.5
    const channelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8)
    const channelMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.6
    })
    const channel = new THREE.Mesh(channelGeo, channelMat)
    channel.position.set(channelX, 0, -0.8)
    scene.add(channel)
  }

  // Na+ ions entering through channels (fewer)
  const ions: { mesh: THREE.Mesh; speed: number; phase: number }[] = []
  for (let i = 0; i < 12; i++) {
    const ionX = -2 + Math.random() * 4
    const ionY = (Math.random() - 0.5) * 2
    const ionZ = -0.5 + Math.random() * 0.3

    const ionGeo = new THREE.SphereGeometry(0.15, 6, 6)
    const ionMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.7
    })
    const ion = new THREE.Mesh(ionGeo, ionMat)
    ion.position.set(ionX, ionY, ionZ)
    scene.add(ion)
    ions.push({ mesh: ion, speed: 0.4 + Math.random() * 0.4, phase: Math.random() })
  }

  // Current flow arrows
  for (let i = 0; i < 5; i++) {
    const arrowX = -1.5 + (i / 4) * 3
    const arrowGeo = new THREE.ConeGeometry(0.15, 0.5, 6)
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      emissive: 0xff4444,
      emissiveIntensity: 0.5
    })
    const arrow = new THREE.Mesh(arrowGeo, arrowMat)
    arrow.rotation.x = Math.PI / 2
    arrow.position.set(arrowX, 1.5, -0.5)
    scene.add(arrow)
  }

  render()

  return (time: number) => {
    const t = time * 0.001
    ions.forEach((ion) => {
      const flow = (t * ion.speed + ion.phase) % 1
      ion.mesh.position.y = -1.5 + flow * 3
    })
  }
}

function renderActionPotential(scene: THREE.Object3D, render: () => void) {
  // Axon cable
  const axonGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 8)
  const axonMat = new THREE.MeshStandardMaterial({ color: 0x666688 })
  const axon = new THREE.Mesh(axonGeo, axonMat)
  axon.rotation.z = Math.PI / 2
  scene.add(axon)

  // Action potential wave propagating (fewer points)
  const wavePoints = 24
  const waveSpheres: THREE.Mesh[] = []
  for (let i = 0; i < wavePoints; i++) {
    const z = -4 + (i / wavePoints) * 8
    const intensity = Math.exp(-((i - 10) ** 2) / 30)
    const sphGeo = new THREE.SphereGeometry(0.2 + intensity * 0.3, 6, 6)
    const sphMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0, 1, 0.5 + intensity * 0.5),
      emissive: new THREE.Color().setHSL(0, 1, intensity),
      emissiveIntensity: 0.7
    })
    const sph = new THREE.Mesh(sphGeo, sphMat)
    sph.position.z = z
    scene.add(sph)
    waveSpheres.push(sph)
  }

  // Magnetic field lines visualization (fewer)
  const fieldLines = 4
  const lines: THREE.Line[] = []
  for (let i = 0; i < fieldLines; i++) {
    const angle = (i / fieldLines) * Math.PI * 2
    const linePoints = []
    for (let j = -4; j <= 4; j += 0.5) {
      const r = 1.5 + Math.sin(j) * 0.5
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r
      linePoints.push(new Vector3(j, x, y))
    }
    const lineGeo = new BufferGeometry().setFromPoints(linePoints)
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6 })
    const line = new THREE.Line(lineGeo, lineMat)
    scene.add(line)
    lines.push(line)
  }

  render()

  return (time: number) => {
    const t = time * 0.001
    const center = Math.sin(t * 0.8) * 3
    waveSpheres.forEach((sph) => {
      const dz = sph.position.z - center
      const intensity = Math.exp(-(dz * dz) / 1.5)
      const scale = 0.8 + intensity * 1.6
      sph.scale.set(scale, scale, scale)
      const mat = sph.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.2 + intensity * 1.2
    })
    lines.forEach((line, idx) => {
      line.rotation.z = t * 0.2 + idx
    })
  }
}

function renderNVCenter(scene: THREE.Object3D, render: () => void) {
  // Diamond lattice structure - simplified (fewer atoms)
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if ((x + y + z) % 2 === 0) {
          const atomGeo = new THREE.SphereGeometry(0.15, 6, 6)
          const atomMat = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.5
          })
          const atom = new THREE.Mesh(atomGeo, atomMat)
          atom.position.set(x * 0.8, y * 0.8, z * 0.8)
          scene.add(atom)
        }
      }
    }
  }

  // Central NV center (defect)
  const nvGeo = new THREE.SphereGeometry(0.3, 8, 8)
  const nvMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 0.8
  })
  const nv = new THREE.Mesh(nvGeo, nvMat)
  scene.add(nv)

  render()

  const orbitGeo = new THREE.TorusGeometry(1.4, 0.03, 6, 64)
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x66ddff, transparent: true, opacity: 0.5 })
  const orbit1 = new THREE.Mesh(orbitGeo, orbitMat)
  const orbit2 = new THREE.Mesh(orbitGeo, orbitMat.clone())
  orbit2.rotation.x = Math.PI / 2
  scene.add(orbit1)
  scene.add(orbit2)

  const electrons: THREE.Mesh[] = []
  const electronGeo = new THREE.SphereGeometry(0.08, 8, 8)
  const electronMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x006666, emissiveIntensity: 0.7 })
  for (let i = 0; i < 6; i++) {
    const e = new THREE.Mesh(electronGeo, electronMat)
    scene.add(e)
    electrons.push(e)
  }

  return (time: number) => {
    const t = time * 0.001
    nv.rotation.y = t * 0.6
    orbit1.rotation.z = t * 0.3
    orbit2.rotation.y = t * 0.4
    electrons.forEach((e, idx) => {
      const angle = t * 1.5 + (idx / electrons.length) * Math.PI * 2
      const ring = idx % 2 === 0 ? orbit1 : orbit2
      const radius = 1.4
      if (ring === orbit1) {
        e.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
      } else {
        e.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      }
    })
  }
}

function renderPhotonDynamics(scene: THREE.Object3D, render: () => void) {
  const greenPhotons: THREE.Mesh[] = []
  const redPhotons: THREE.Mesh[] = []

  // Green photons incoming
  for (let i = 0; i < 12; i++) {
    const photonGeo = new THREE.SphereGeometry(0.1, 6, 6)
    const photonMat = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.8
    })
    const photon = new THREE.Mesh(photonGeo, photonMat)
    photon.position.set(-5 + i * 0.8, 2, 0)
    scene.add(photon)
    greenPhotons.push(photon)
  }

  // Central electron being excited and emitting red
  const electronGeo = new THREE.SphereGeometry(0.3, 8, 8)
  const electronMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 0.7
  })
  const electron = new THREE.Mesh(electronGeo, electronMat)
  scene.add(electron)

  // Red photons emitted outward
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const redPhotonGeo = new THREE.SphereGeometry(0.12, 6, 6)
    const redPhotonMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.8
    })
    const redPhoton = new THREE.Mesh(redPhotonGeo, redPhotonMat)
    redPhoton.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0)
    scene.add(redPhoton)
    redPhotons.push(redPhoton)
  }

  render()

  return (time: number) => {
    const t = time * 0.001
    greenPhotons.forEach((photon, idx) => {
      const offset = (t * 1.2 + idx * 0.15) % 6
      photon.position.x = -5 + offset
      photon.position.y = 1.5 + Math.sin(t * 2 + idx) * 0.2
      if (photon.position.x > 0.5) photon.position.x = -5
    })
    redPhotons.forEach((photon, idx) => {
      const angle = t * 1.4 + idx
      const radius = 1.5 + (t * 0.4) % 1.5
      photon.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 0.7) * 0.8)
      const mat = photon.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.4 + 0.6 * (0.5 + Math.sin(t * 3 + idx))
    })
  }
}

function renderGreenLight(scene: THREE.Object3D, render: () => void) {
  // Incoming green light beam
  const beamGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 8)
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.2
  })
  const beam = new THREE.Mesh(beamGeo, beamMat)
  beam.rotation.z = Math.PI / 2
  scene.add(beam)

  // Target (NV center)
  const targetGeo = new THREE.SphereGeometry(0.5, 8, 8)
  const targetMat = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.8
  })
  const target = new THREE.Mesh(targetGeo, targetMat)
  scene.add(target)

  // Scattered light particles (fewer)
  const particles: { mesh: THREE.Mesh; angle: number; radius: number }[] = []
  for (let i = 0; i < 24; i++) {
    const angle = Math.random() * Math.PI * 2
    const elevation = Math.random() * Math.PI
    const radius = 2 + Math.random() * 2

    const particleGeo = new THREE.SphereGeometry(0.08, 4, 4)
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: Math.random() * 0.8
    })
    const particle = new THREE.Mesh(particleGeo, particleMat)
    particle.position.set(
      Math.cos(angle) * Math.sin(elevation) * radius,
      Math.sin(angle) * Math.sin(elevation) * radius,
      Math.cos(elevation) * radius
    )
    scene.add(particle)
    particles.push({ mesh: particle, angle, radius })
  }

  render()

  return (time: number) => {
    const t = time * 0.001
    beamMat.opacity = 0.15 + 0.2 * (0.5 + Math.sin(t * 3))
    target.scale.set(1 + Math.sin(t * 4) * 0.06, 1 + Math.sin(t * 4) * 0.06, 1)
    particles.forEach((p, idx) => {
      const r = p.radius + (t * 0.4 + idx * 0.1) % 1.5
      p.mesh.position.set(Math.cos(p.angle) * r, Math.sin(p.angle) * r, Math.sin(p.angle * 1.3) * r * 0.3)
      const mat = p.mesh.material as THREE.MeshStandardMaterial
      mat.opacity = 0.2 + 0.6 * (0.5 + Math.sin(t * 2 + idx))
    })
  }
}

function renderWaveguide(scene: THREE.Object3D, render: () => void) {
  // Waveguide core (high index)
  const coreGeo = new THREE.BoxGeometry(0.5, 0.2, 8)
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    metalness: 0.4
  })
  const core = new THREE.Mesh(coreGeo, coreMat)
  scene.add(core)

  // Cladding
  const claddingGeo = new THREE.BoxGeometry(1.2, 0.6, 8)
  const claddingMat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.2,
    transparent: true,
    opacity: 0.7
  })
  const cladding = new THREE.Mesh(claddingGeo, claddingMat)
  scene.add(cladding)

  // Light rays inside waveguide (TIR - fewer)
  for (let i = 0; i < 3; i++) {
    const rayPoints = []
    const amplitude = 0.15 + (i * 0.08)
    for (let j = -4; j <= 4; j += 0.5) {
      const y = Math.sin(j * 0.5 + i) * amplitude
      rayPoints.push(new Vector3(j, y, 0))
    }
    const rayGeo = new BufferGeometry().setFromPoints(rayPoints)
    const rayMat = new THREE.LineBasicMaterial({ color: 0xff0000 })
    const ray = new THREE.Line(rayGeo, rayMat)
    scene.add(ray)
  }

  // Photons bouncing inside (fewer)
  const photons: { mesh: THREE.Mesh; phase: number }[] = []
  for (let i = 0; i < 12; i++) {
    const z = -4 + Math.random() * 8
    const y = (Math.random() - 0.5) * 0.15
    const photonGeo = new THREE.SphereGeometry(0.1, 6, 6)
    const photonMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.8
    })
    const photon = new THREE.Mesh(photonGeo, photonMat)
    photon.position.set(z, y, 0)
    scene.add(photon)
    photons.push({ mesh: photon, phase: Math.random() * Math.PI * 2 })
  }

  render()

  return (time: number) => {
    const t = time * 0.001
    photons.forEach((p, idx) => {
      const progress = (t * 0.6 + idx / photons.length) % 1
      const z = -4 + progress * 8
      const y = Math.sin(t * 4 + p.phase) * 0.12
      p.mesh.position.set(z, y, 0)
    })
  }
}

function renderRedBeam(scene: THREE.Object3D, render: () => void) {
  // Exiting red beam
  const beamGeo = new THREE.CylinderGeometry(0.5, 1, 6, 8)
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.3
  })
  const beam = new THREE.Mesh(beamGeo, beamMat)
  beam.rotation.z = Math.PI / 2
  beam.position.x = 3
  scene.add(beam)

  // Expanding cone of light
  const coneGeo = new THREE.ConeGeometry(2, 6, 8)
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.15
  })
  const cone = new THREE.Mesh(coneGeo, coneMat)
  cone.rotation.z = Math.PI / 2
  cone.position.x = 4
  scene.add(cone)

  // Red photons escaping (fewer)
  const photons: { mesh: THREE.Mesh; angle: number; offset: number }[] = []
  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2
    const elevation = Math.random() * 0.5
    const distance = 1 + Math.random() * 3

    const photonGeo = new THREE.SphereGeometry(0.1, 6, 6)
    const photonMat = new THREE.MeshStandardMaterial({
      color: 0xff3333,
      emissive: 0xff3333,
      emissiveIntensity: 0.8
    })
    const photon = new THREE.Mesh(photonGeo, photonMat)
    photon.position.set(
      4 + Math.cos(angle) * distance,
      Math.sin(angle) * Math.sin(elevation) * distance,
      Math.cos(angle) * Math.sin(elevation) * distance
    )
    scene.add(photon)
    photons.push({ mesh: photon, angle, offset: Math.random() * 2 })
  }

  render()

  return (time: number) => {
    const t = time * 0.001
    beamMat.opacity = 0.2 + 0.2 * (0.5 + Math.sin(t * 3))
    photons.forEach((p, idx) => {
      const r = 1 + ((t * 0.6 + p.offset + idx * 0.1) % 3)
      p.mesh.position.set(
        4 + Math.cos(p.angle) * r,
        Math.sin(p.angle) * r * 0.3,
        Math.cos(p.angle) * r * 0.2
      )
    })
  }
}

function renderOptics(scene: THREE.Object3D, render: () => void) {
  // Incoming beam
  const inBeamGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 8)
  const inBeamMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.3
  })
  const inBeam = new THREE.Mesh(inBeamGeo, inBeamMat)
  inBeam.rotation.z = Math.PI / 2
  inBeam.position.x = -2
  scene.add(inBeam)

  // Lens 1
  const lens1Geo = new THREE.SphereGeometry(0.8, 8, 8)
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x0088ff,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6
  })
  const lens1 = new THREE.Mesh(lens1Geo, lensMat)
  lens1.position.x = -0.5
  scene.add(lens1)

  // Mirror
  const mirrorGeo = new THREE.PlaneGeometry(2, 2)
  const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9
  })
  const mirror = new THREE.Mesh(mirrorGeo, mirrorMat)
  mirror.position.set(1, 0, 0)
  mirror.rotation.y = Math.PI / 4
  scene.add(mirror)

  // Lens 2 (focusing)
  const lens2 = new THREE.Mesh(lens1Geo.clone(), lensMat.clone())
  lens2.position.x = 2.5
  scene.add(lens2)

  // Focused beam going down
  const focusGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 8)
  const focusMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.4
  })
  const focusBeam = new THREE.Mesh(focusGeo, focusMat)
  focusBeam.position.set(3, -1.5, 0)
  scene.add(focusBeam)

  render()

  return (time: number) => {
    const t = time * 0.001
    inBeamMat.opacity = 0.2 + 0.2 * (0.5 + Math.sin(t * 2))
    focusMat.opacity = 0.3 + 0.3 * (0.5 + Math.sin(t * 3))
    mirror.rotation.y = Math.PI / 4 + Math.sin(t) * 0.05
  }
}

function renderPhotodiode(scene: THREE.Object3D, render: () => void) {
  // Incoming focused beam
  const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 8)
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.4
  })
  const beam = new THREE.Mesh(beamGeo, beamMat)
  beam.position.y = 1
  scene.add(beam)

  // Photodiode (rectangular detector)
  const diodeGeo = new THREE.BoxGeometry(1, 1, 0.1)
  const diodeMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7
  })
  const diode = new THREE.Mesh(diodeGeo, diodeMat)
  scene.add(diode)

  // Active area (glowing)
  const activeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.05)
  const activeMat = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.8,
    metalness: 0.3
  })
  const active = new THREE.Mesh(activeGeo, activeMat)
  active.position.z = 0.05
  diode.add(active)

  render()

  return (time: number) => {
    const t = time * 0.001
    active.scale.set(1 + Math.sin(t * 6) * 0.05, 1 + Math.sin(t * 6) * 0.05, 1)
    activeMat.emissiveIntensity = 0.5 + 0.5 * (0.5 + Math.sin(t * 6))
  }
}

function renderHeatmap(scene: THREE.Object3D, render: () => void) {
  const size = 160
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const heatTexture = new THREE.CanvasTexture(canvas)

  const heatGeo = new THREE.PlaneGeometry(6, 6)
  const heatMat = new THREE.MeshBasicMaterial({
    map: heatTexture,
    transparent: true
  })
  const heat = new THREE.Mesh(heatGeo, heatMat)
  scene.add(heat)

  const updateHeatmap = (time: number) => {
    const imageData = ctx.createImageData(size, size)
    const data = imageData.data
    const t = time * 0.001

    const cx1 = Math.cos(t * 0.6) * 30
    const cy1 = Math.sin(t * 0.8) * 20
    const cx2 = Math.cos(t * 0.7 + 2) * 25
    const cy2 = Math.sin(t * 0.5 + 1.2) * 25

    for (let i = 0; i < data.length; i += 4) {
      const idx = i / 4
      const x = (idx % size) - size / 2
      const y = Math.floor(idx / size) - size / 2

      const d1 = Math.hypot(x - cx1, y - cy1)
      const d2 = Math.hypot(x - cx2, y - cy2)
      const v1 = Math.exp(-(d1 * d1) / 900)
      const v2 = Math.exp(-(d2 * d2) / 900)
      const value = Math.min(1, v1 + v2)

      const hue = value * 0.7
      const rgb = hslToRgb(hue, 1, 0.5)
      data[i] = rgb[0]
      data[i + 1] = rgb[1]
      data[i + 2] = rgb[2]
      data[i + 3] = 220 * value
    }
    ctx.putImageData(imageData, 0, 0)
    heatTexture.needsUpdate = true
  }

  updateHeatmap(0)
  render()

  let lastUpdate = 0
  return (time: number) => {
    if (time - lastUpdate > 50) {
      updateHeatmap(time)
      lastUpdate = time
    }
  }
}

function renderAIGraph(scene: THREE.Object3D, render: () => void) {
  // Background grid
  const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
  gridHelper.position.z = -2
  scene.add(gridHelper)

  // X and Y axes
  const xAxis = new THREE.Line(
    new BufferGeometry().setFromPoints([new Vector3(-4, 0, 0), new Vector3(4, 0, 0)]),
    new THREE.LineBasicMaterial({ color: 0xff4444 })
  )
  const yAxis = new THREE.Line(
    new BufferGeometry().setFromPoints([new Vector3(0, -3, 0), new Vector3(0, 3, 0)]),
    new THREE.LineBasicMaterial({ color: 0x44ff44 })
  )
  scene.add(xAxis)
  scene.add(yAxis)

  // Neural activity classifications - bar chart (simplified)
  const classes = [
    { name: 'Resting', value: 0.4, color: 0x4444ff },
    { name: 'Active', value: 0.8, color: 0xff4444 },
    { name: 'Spike', value: 0.95, color: 0xffff44 },
    { name: 'Oscillation', value: 0.65, color: 0x44ff44 }
  ]

  const barWidth = 0.8
  const spacing = 2
  const bars: THREE.Mesh[] = []
  classes.forEach((cls, idx) => {
    const x = -3 + idx * spacing
    const height = cls.value * 2.5

    const barGeo = new THREE.BoxGeometry(barWidth, height, 0.2)
    const barMat = new THREE.MeshStandardMaterial({
      color: cls.color,
      emissive: cls.color,
      emissiveIntensity: 0.5
    })
    const bar = new THREE.Mesh(barGeo, barMat)
    bar.position.set(x, height / 2, 0)
    scene.add(bar)
    bars.push(bar)
  })

  render()

  return (time: number) => {
    const t = time * 0.001
    bars.forEach((bar, idx) => {
      const pulse = 0.9 + Math.sin(t * 2.2 + idx) * 0.1
      bar.scale.y = pulse
      bar.position.y = (bar.geometry as THREE.BoxGeometry).parameters.height * 0.5 * pulse
    })
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
