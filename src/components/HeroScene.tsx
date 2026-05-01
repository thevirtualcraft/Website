'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.15
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1.8, 128, 128]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#7c3aed"
          roughness={0.15}
          metalness={0.9}
          distort={0.35}
          speed={2}
          envMapIntensity={1}
        />
      </Sphere>
    </Float>
  )
}

function ParticleField() {
  const count = 2000
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25
    }
    return pos
  }, [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a78bfa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function OrbitingRing({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * speed
    }
  })

  return (
    <mesh ref={ringRef} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color="#7c3aed" transparent opacity={0.3} />
    </mesh>
  )
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      className="!absolute inset-0"
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#e0e0ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#7c3aed" />
      <pointLight position={[3, -5, -3]} intensity={0.5} color="#a78bfa" />

      <AnimatedSphere />
      <ParticleField />
      <OrbitingRing radius={3} speed={0.3} tilt={1.2} />
      <OrbitingRing radius={3.5} speed={-0.2} tilt={0.8} />
      <OrbitingRing radius={4} speed={0.15} tilt={1.6} />
      <Stars radius={50} depth={80} count={3000} factor={3} saturation={0.5} fade speed={0.5} />
    </Canvas>
  )
}
