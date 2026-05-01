'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ArrowDown, Play } from 'lucide-react'

const HeroScene = dynamic(
  () => import('./HeroScene').then((mod) => ({ default: mod.HeroScene })),
  { ssr: false }
)

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient">
      <HeroScene />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-brand-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            WebXR Experiences — Enter the Future
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
        >
          Crafting
          <br />
          <span className="text-gradient">Immersive</span>
          <br />
          Digital Worlds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          We build breathtaking 3D and WebXR experiences that run directly in
          your browser. Step into virtual worlds, interact with spatial content,
          and explore the frontier of immersive web.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
