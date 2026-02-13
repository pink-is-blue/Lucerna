'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function NVCenterViz() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [redLight, setRedLight] = useState(0)
  const [microwave, setMicrowave] = useState(0)
  const [detection, setDetection] = useState(0)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a1a)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 5, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    // NV Center (diamond octahedron)
    const diamondGeo = new THREE.OctahedronGeometry(0.5, 2)
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0x66ddff,
      emissive: 0x0088ff,
      emissiveIntensity: 0.3,
      metalness: 0.4,
      roughness: 0.3
    })
    const nvCenterMesh = new THREE.Mesh(diamondGeo, diamondMat)
    nvCenterMesh.position.set(0, 0, 0)
    scene.add(nvCenterMesh)

    // Red excitation light group
    const redLightGroup = new THREE.Group()
    scene.add(redLightGroup)

    // Red photons (small spheres orbiting NV center)
    const redPhotons: THREE.Mesh[] = []
    for (let i = 0; i < 12; i++) {
      const photonGeo = new THREE.SphereGeometry(0.08, 8, 8)
      const photonMat = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff3333,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0
      })
      const photon = new THREE.Mesh(photonGeo, photonMat)
      redLightGroup.add(photon)
      redPhotons.push(photon)
    }

    // Red beam indicator
    const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16)
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xff3333,
      transparent: true,
      opacity: 0.2
    })
    const beamMesh = new THREE.Mesh(beamGeo, beamMat)
    beamMesh.position.set(0, 2, 0)
    redLightGroup.add(beamMesh)

    // Microwave signal group
    const microwaveGroup = new THREE.Group()
    scene.add(microwaveGroup)

    // Microwave arrows
    for (let i = 0; i < 6; i++) {
      const arrowGeo = new THREE.ConeGeometry(0.15, 0.4, 8)
      const arrowMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff8800,
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0
      })
      const arrow = new THREE.Mesh(arrowGeo, arrowMat)
      arrow.position.x = -2 + (i / 5) * 4
      arrow.position.y = -1
      microwaveGroup.add(arrow)
    }

    // Detection plane with dynamic heatmap
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    const updateHeatmap = (intensity: number) => {
      const imgData = ctx.createImageData(256, 256)
      for (let i = 0; i < 256; i++) {
        for (let j = 0; j < 256; j++) {
          const dx = i - 128
          const dy = j - 128
          const dist = Math.sqrt(dx*dx + dy*dy)
          const val = Math.exp(-dist * dist / (5000 + 1000 * intensity)) * intensity
          
          // Color gradient: blue -> cyan -> yellow -> red
          let r = 0, g = 0, b = 0
          if (val < 0.3) {
            b = val / 0.3
          } else if (val < 0.6) {
            b = 1 - (val - 0.3) / 0.3
            g = (val - 0.3) / 0.3
          } else {
            g = 1
            r = (val - 0.6) / 0.4
          }
          
          const idx = (j * 256 + i) * 4
          imgData.data[idx] = Math.floor(r * 255)
          imgData.data[idx + 1] = Math.floor(g * 255)
          imgData.data[idx + 2] = Math.floor(b * 255)
          imgData.data[idx + 3] = Math.floor(200 * val)
        }
      }
      ctx.putImageData(imgData, 0, 0)
    }
    
    updateHeatmap(0)
    const heatTexture = new THREE.CanvasTexture(canvas)
    const detectionGeo = new THREE.PlaneGeometry(4, 4)
    const detectionMat = new THREE.MeshBasicMaterial({
      map: heatTexture,
      transparent: true,
      opacity: 0.3
    })
    const detectionPlane = new THREE.Mesh(detectionGeo, detectionMat)
    detectionPlane.position.y = -3
    detectionPlane.rotation.x = -Math.PI / 4
    scene.add(detectionPlane)

    // Animation loop
    let animTime = 0
    const stepDuration = 100 // frames per step

    const animate = () => {
      requestAnimationFrame(animate)
      animTime++

      const currentStep = Math.floor((animTime % (stepDuration * 4)) / stepDuration)
      setStep(currentStep)

      // Auto-animate sliders based on current step
      let r = 0, m = 0, d = 0

      if (currentStep === 0) {
        // Step 1: Red light excitation ramps up
        r = (animTime % stepDuration) / stepDuration
      } else if (currentStep === 1) {
        // Step 2: Red light stays high, microwave ramps up
        r = 1
        m = (animTime % stepDuration) / stepDuration
      } else if (currentStep === 2) {
        // Step 3: Red light turns off, microwave stays high, detection ramps up
        r = 1 - (animTime % stepDuration) / stepDuration
        m = 1
        d = (animTime % stepDuration) / stepDuration
      } else {
        // Step 4: Full detection signal visible
        m = 1
        d = 1
      }

      setRedLight(r)
      setMicrowave(m)
      setDetection(d)

      // Update red photons animation
      redPhotons.forEach((photon, i) => {
        const angle = (animTime * 0.05 + i * (Math.PI * 2 / 12)) % (Math.PI * 2)
        const radius = 1 + r
        photon.position.x = Math.cos(angle) * radius * r
        photon.position.y = Math.sin(angle) * radius * r + 1.5
        photon.position.z = Math.cos(angle * 0.7) * radius * r
        ;(photon.material as THREE.Material).opacity = r
      })

      // Red beam opacity
      ;(beamMesh.material as THREE.Material).opacity = r * 0.3

      // NV center vibration/pulsing with red light
      nvCenterMesh.scale.set(1 + r * 0.1, 1 + r * 0.1, 1 + r * 0.1)
      nvCenterMesh.rotation.x += r * 0.01
      nvCenterMesh.rotation.y += r * 0.015

      // Microwave arrows animation
      microwaveGroup.children.forEach((arrow, i) => {
        ;(arrow.material as THREE.Material).opacity = m * 0.8
        arrow.position.z = Math.sin(animTime * 0.05 + i * Math.PI / 3) * 0.3 * m
      })

      // Update heatmap based on detection
      updateHeatmap(d * 1.2)
      ;(detectionMat as THREE.Material).opacity = 0.3 + d * 0.5

      // Orbiting camera
      const cameraAngle = (animTime * 0.005) % (Math.PI * 2)
      camera.position.x = Math.cos(cameraAngle) * 8
      camera.position.z = Math.sin(cameraAngle) * 8
      camera.lookAt(0, 0.5, 0)

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Control Panel */}
      <div className="absolute top-8 left-8 bg-black/70 p-6 rounded-xl space-y-4 max-w-sm backdrop-blur-md border border-cyan-500/30 shadow-lg">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
          NV Center ODMR
        </h1>

        {/* Red Light Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-red-400">🔴 Red Light Intensity</label>
            <span className="text-lg font-bold text-red-400">{(redLight * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full transition-all" style={{ width: `${redLight * 100}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Excitation photons prepare quantum state</p>
        </div>

        {/* Microwave Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-yellow-400">🌊 Microwave Power</label>
            <span className="text-lg font-bold text-yellow-400">{(microwave * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full transition-all" style={{ width: `${microwave * 100}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Spin resonance (ODMR) at resonant frequency</p>
        </div>

        {/* Detection Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-cyan-400">🔵 Detection Signal</label>
            <span className="text-lg font-bold text-cyan-400">{(detection * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full transition-all" style={{ width: `${detection * 100}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Fluorescence collection → magnetic field readout</p>
        </div>

        {/* Step Indicator */}
        <div className="pt-4 border-t border-gray-600">
          <div className="text-sm font-semibold text-gray-300 mb-3">
            Step {step + 1}/4: {
              step === 0 ? 'Excitation' :
              step === 1 ? 'Spin Control' :
              step === 2 ? 'Readout' :
              'Detection Complete'
            }
          </div>
          <div className="text-xs text-gray-400 space-y-2 bg-gray-900/50 p-3 rounded">
            {step === 0 && (
              <div>
                <p className="font-semibold text-red-300">🔴 Red laser → NV center excitation</p>
                <p>Electrons transition to excited state, prepare quantum properties</p>
              </div>
            )}
            {step === 1 && (
              <div>
                <p className="font-semibold text-yellow-300">🌊 Microwave → Spin resonance</p>
                <p>Drive spin transitions at ODMR frequency, entangle with nearby fields</p>
              </div>
            )}
            {step === 2 && (
              <div>
                <p className="font-semibold text-cyan-300">🔵 Readout → Photon collection</p>
                <p>Detect fluorescence photons, sensitivity to magnetic field variations</p>
              </div>
            )}
            {step === 3 && (
              <div>
                <p className="font-semibold text-purple-300">📊 Heatmap → Magnetic field map</p>
                <p>Spatial and temporal evolution reveals neural current patterns</p>
              </div>
            )}
          </div>
        </div>

        {/* Process Info */}
        <div className="pt-4 border-t border-gray-600 text-xs text-gray-400">
          <p className="font-semibold text-gray-300 mb-2">Process Flow:</p>
          <p>1️⃣ <span className="text-red-300">Red laser</span> excites NV center</p>
          <p>2️⃣ <span className="text-yellow-300">Microwaves</span> apply spin control</p>
          <p>3️⃣ <span className="text-cyan-300">Readout</span> collects entangled photons</p>
          <p>4️⃣ <span className="text-purple-300">Heatmap</span> maps neural magnetic signals</p>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-8 right-8 bg-black/70 p-5 rounded-lg backdrop-blur-md border border-purple-500/30 max-w-xs shadow-lg">
        <p className="font-semibold text-purple-300 mb-2">🔬 How NV Magnetometry Works</p>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• <strong>Room-temperature sensing</strong> of ultraweak magnetic fields (1-100 pT)</li>
          <li>• <strong>Neural signals detected</strong> via directional photonic waveguides</li>
          <li>• <strong>Glide-symmetric topology</strong> removes decoherence without cryogenics</li>
          <li>• <strong>Real-time imaging</strong> of neural activity with cell-level resolution</li>
        </ul>
      </div>
    </div>
  )
}
