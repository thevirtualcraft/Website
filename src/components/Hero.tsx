'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ArrowDown, Play, Sparkles, Boxes, Headset } from 'lucide-react'

const HeroScene = dynamic(
  () => import('./HeroScene').then((mod) => ({ default: mod.HeroScene })),
  { ssr: false }
)

const ROTATING_WORDS = ['Immersive', 'Spatial', 'Real-time', 'Interactive']

const STATS = [
  { value: '50+', label: 'Experiences shipped' },
  { value: '60fps', label: 'On mid-range devices' },
  { value: '0', label: 'App-store installs' },
]

const TECH = [
  'WebXR',
  'Three.js',
  'React Three Fiber',
  'WebGL',
  'WebGPU',
  'glTF',
  'Vision Pro',
  'Meta Quest',
  'WebAR',
]

function RotatingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % ROTATING_WORDS.length),
      2200
    )
    return () => clearInterval(id)
  }, [])

  return (
    <span className="relative inline-flex justify-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[index]}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-gradient-animated"
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function FloatingChip({
  icon: Icon,
  label,
  className,
  delay,
}: {
  icon: typeof Sparkles
  label: string
  className: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={`hidden lg:flex absolute z-10 items-center gap-2 px-4 py-2.5 glass-card rounded-2xl text-sm text-white/80 animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon size={16} className="text-brand-300" />
      {label}
    </motion.div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-backdrop" />
      <div className="aurora-blob w-[38rem] h-[38rem] bg-brand-600/40 -top-40 -left-32 animate-aurora" />
      <div
        className="aurora-blob w-[32rem] h-[32rem] bg-cyan-500/20 top-20 -right-24 animate-aurora"
        style={{ animationDelay: '4s' }}
      />
      <div
        className="aurora-blob w-[30rem] h-[30rem] bg-fuchsia-500/20 -bottom-32 left-1/3 animate-aurora"
        style={{ animationDelay: '8s' }}
      />

      <HeroScene />

      {/* Floating capability chips */}
      <FloatingChip icon={Headset} label="Enter in VR" className="top-32 left-[8%]" delay={1.1} />
      <FloatingChip icon={Boxes} label="Real-time 3D" className="bottom-40 left-[12%]" delay={1.4} />
      <FloatingChip icon={Sparkles} label="No installs" className="top-40 right-[9%]" delay={1.25} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-brand-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            WebXR Studio — Enter the Future
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
        >
          We craft
          <br />
          <RotatingWord />
          <br />
          digital worlds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We build breathtaking 3D and WebXR experiences that run directly in
          your browser. Step into virtual worlds, interact with spatial content,
          and explore the frontier of the immersive web.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <a
            href="#experience"
            className="group flex items-center gap-3 px-8 py-4 bg-brand-500 hover:bg-brand-600 rounded-2xl font-medium transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/25 hover:-translate-y-0.5"
          >
            <Play size={18} className="group-hover:scale-110 transition-transform" />
            Try WebXR Demo
          </a>
          <a
            href="#showcase"
            className="flex items-center gap-3 px-8 py-4 glass-card hover:bg-white/[0.08] rounded-2xl font-medium transition-all duration-300 hover:-translate-y-0.5"
          >
            View Portfolio
          </a>
        </motion.div>

        {/* Live stat badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center justify-center gap-8 sm:gap-12"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl sm:text-3xl font-bold text-gradient">
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest text-white/40 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Technology marquee */}
      <div className="absolute bottom-24 left-0 right-0 z-10 marquee-mask">
        <div className="flex w-max animate-marquee gap-4 whitespace-nowrap">
          {[...TECH, ...TECH].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="px-4 py-2 rounded-full glass text-xs uppercase tracking-widest text-white/40"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#showcase"
          className="flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown size={16} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  )
}
