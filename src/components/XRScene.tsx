'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Float,
  MeshDistortMaterial,
  Text,
  RoundedBox,
  ContactShadows,
} from '@react-three/drei'
import * as THREE from 'three'

function InteractiveObject({
  position,
  color,
  label,
}: {
  position: [number, number, number]
  color: string
  label: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5
      const scale = clicked ? 1.3 : hovered ? 1.15 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        0.1
      )
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => {
            setHovered(false)
            setClicked(false)
          }}
          onClick={() => setClicked(!clicked)}
          castShadow
        >
          <icosahedronGeometry args={[0.6, 2]} />
          <MeshDistortMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
            distort={hovered ? 0.4 : 0.2}
            speed={3}
          />
        </mesh>
        {hovered && (
          <Text
            position={[0, 1.1, 0]}
            fontSize={0.18}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-medium.woff"
          >
            {label}
          </Text>
        )}
        <pointLight
          color={color}
          intensity={hovered ? 2 : 0.5}
          distance={3}
        />
      </group>
    </Float>
  )
}

function Platform() {
  return (
    <group position={[0, -1.5, 0]}>
      <RoundedBox args={[8, 0.15, 8]} radius={0.08} smoothness={4} receiveShadow>
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.7}
        />
      </RoundedBox>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color="#0a0a1a"
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}

function GridFloor() {
  return (
    <gridHelper
      args={[20, 40, '#2a2a3a', '#1a1a24']}
      position={[0, -1.42, 0]}
    />
  )
}

function FloatingUI() {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1 + 2.5
    }
  })

  return (
    <group ref={ref} position={[0, 2.5, -2]}>
      <RoundedBox args={[3, 0.8, 0.05]} radius={0.04} smoothness={4}>
        <meshStandardMaterial
          color="#7c3aed"
          roughness={0.3}
          metalness={0.5}
          transparent
          opacity={0.8}
        />
      </RoundedBox>
      <Text
        position={[0, 0.05, 0.03]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {'Interactive 3D Scene\nClick objects to interact'}
      </Text>
    </group>
  )
}

export function XRScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 6], fov: 50 }}
      dpr={[1, 2]}
      className="!absolute inset-0"
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#0a0a0f', 8, 25]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <InteractiveObject position={[-2, 0, 0]} color="#7c3aed" label="Virtual Reality" />
      <InteractiveObject position={[0, 0.5, -1]} color="#06b6d4" label="Augmented Reality" />
      <InteractiveObject position={[2, 0, 0]} color="#f43f5e" label="Mixed Reality" />
      <InteractiveObject position={[-1, -0.3, 1.5]} color="#10b981" label="Spatial Computing" />
      <InteractiveObject position={[1, -0.3, 1.5]} color="#f59e0b" label="3D Web" />

      <FloatingUI />
      <Platform />
      <GridFloor />

      <ContactShadows
        position={[0, -1.42, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      <Environment preset="night" />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}
