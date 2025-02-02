"use client"

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

const PulseMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime()
    }
  })

  return (
    <shaderMaterial
      ref={materialRef}
      transparent
      uniforms={{
        time: { value: 0 },
        color: { value: new THREE.Color("#2563eb") },
      }}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        
        void main() {
          float pulse = sin(vUv.x * 10.0 - time * 2.0) * 0.5 + 0.5;
          float alpha = smoothstep(0.0, 0.1, pulse) * smoothstep(1.0, 0.9, pulse) * 0.5;
          gl_FragColor = vec4(color, alpha);
        }
      `}
    />
  )
}

const GlobeObject = () => {
  const globeRef = useRef<THREE.Mesh>(null)
  const routesRef = useRef<THREE.Group>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
    if (routesRef.current) {
      routesRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  if (!mounted) return null

  // Create supply chain routes with outward curves
  const routes = [
    { start: [0.5, 0.2, 0.8], end: [-0.5, -0.3, 0.7] },
    { start: [-0.7, 0.5, 0.2], end: [0.6, -0.2, -0.5] },
    { start: [0.3, -0.6, 0.4], end: [-0.4, 0.5, -0.6] },
    { start: [-0.2, 0.7, -0.3], end: [0.5, -0.4, 0.6] },
  ] as const

  const createArcPoints = (start: THREE.Vector3, end: THREE.Vector3) => {
    const middle = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const direction = middle.clone().normalize()
    const controlPoint = direction.multiplyScalar(2.5)
    const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end)
    return curve.getPoints(50)
  }

  return (
    <>
      {/* Globe */}
      <Sphere ref={globeRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          color="#2563eb"
          opacity={0.95}
          transparent
          wireframe
        />
      </Sphere>

      {/* Atmosphere */}
      <Sphere args={[1.1, 64, 64]}>
        <meshPhongMaterial
          color="#2563eb"
          opacity={0.1}
          transparent
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Supply Chain Routes */}
      <group ref={routesRef}>
        {routes.map((route, index) => {
          const startPoint = new THREE.Vector3(...route.start)
          const endPoint = new THREE.Vector3(...route.end)
          const points = createArcPoints(startPoint, endPoint)
          const geometry = new THREE.BufferGeometry().setFromPoints(points)

          return (
            <group key={index}>
              {/* Base line */}
              {/* @ts-ignore */}
              <line geometry={geometry}>
                <lineBasicMaterial
                  color="#2563eb"
                  opacity={0.2}
                  transparent
                  linewidth={2}
                />
              </line>
              {/* Animated pulse line */}
              {/* @ts-ignore */}
              <line geometry={geometry}>
                <PulseMaterial />
              </line>
            </group>
          )
        })}

        {/* Data Points with Glow */}
        {routes.map((route, index) => (
          <group key={`points-${index}`}>
            {[route.start, route.end].map((point, i) => (
              <group key={i}>
                {/* Core point */}
                <mesh position={new THREE.Vector3(...point)}>
                  <sphereGeometry args={[0.02, 16, 16]} />
                  <meshBasicMaterial color="#2563eb" />
                </mesh>
                {/* Glow effect */}
                <mesh position={new THREE.Vector3(...point)}>
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <meshBasicMaterial
                    color="#2563eb"
                    transparent
                    opacity={0.3}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#2563eb" />
    </>
  )
}

const Globe = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.4}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <GlobeObject />
      </Canvas>
    </div>
  )
}

export default Globe 