'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Bounds } from '@react-three/drei'

function DooDooModel() {
  const gltf = useGLTF('./models/doo-doo.glb')

  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  )
}

useGLTF.preload('./models/doo-doo.glb')

export default function DooDooModelFrame() {
  return (
    <div className="glass-dark p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">3D Model Frame</h3>
          <p className="text-sm text-gray-400">Drag to rotate · Scroll to zoom</p>
        </div>
      </div>

      <div className="h-[420px] rounded-lg overflow-hidden border border-cyan-500/20 bg-black/40">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={1.0} />
          <directionalLight position={[6, 6, 6]} intensity={1.2} />
          <directionalLight position={[-6, -4, -6]} intensity={0.6} />

          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.1}>
              <DooDooModel />
            </Bounds>
          </Suspense>

          <OrbitControls enablePan={false} minDistance={2} maxDistance={20} />
        </Canvas>
      </div>
    </div>
  )
}
