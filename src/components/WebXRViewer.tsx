'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Glasses, Monitor, Smartphone, RotateCcw, Info } from 'lucide-react'

const XRScene = dynamic(
  () => import('./XRScene').then((mod) => ({ default: mod.XRScene })),
  { ssr: false }
)

export function WebXRViewer() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true })
  const [xrSupported, setXrSupported] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr
        ?.isSessionSupported?.('immersive-vr')
        .then((supported: boolean) => setXrSupported(supported))
        .catch(() => setXrSupported(false))
    } else {
      setXrSupported(false)
    }
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-32 section-gradient"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full glass text-sm text-brand-300 font-medium mb-6"
          >
            WebXR Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            Try It <span className="text-gradient">Yourself</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Interact with this 3D scene right in your browser. Click and drag to
            orbit, scroll to zoom, and click objects to explore.
            {xrSupported && ' Put on your headset to enter VR!'}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="glass-card glow-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-white/40 font-mono">
                  webxr-scene.glb — The Virtual Craft
                </span>
              </div>
              <div className="flex items-center gap-2">
                {xrSupported && (
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-xs font-medium transition-colors">
                    <Glasses size={14} />
                    Enter VR
                  </button>
                )}
                <button className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/50 hover:text-white">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className="relative h-[500px] sm:h-[600px] bg-surface-dark">
              <XRScene />
            </div>

            <div className="flex items-center gap-6 px-5 py-3 border-t border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Monitor size={14} />
                <span>Desktop</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Smartphone size={14} />
                <span>Mobile</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Glasses size={14} />
                <span className={xrSupported ? 'text-green-400' : ''}>
                  VR {xrSupported ? 'Ready' : 'Not Available'}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-white/30">
                <Info size={12} />
                Drag to rotate · Scroll to zoom · Click to interact
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
