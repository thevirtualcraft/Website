'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Award, Rocket, Target } from 'lucide-react'

const stats = [
  { value: '50+', label: 'Projects Delivered', icon: Rocket },
  { value: '30+', label: 'Happy Clients', icon: Users },
  { value: '5+', label: 'Years Experience', icon: Award },
  { value: '99%', label: 'Client Satisfaction', icon: Target },
]

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="about" className="relative py-32 section-gradient">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full glass text-sm text-brand-300 font-medium mb-6"
            >
              About Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl font-bold mb-6"
            >
              Pushing the Boundaries of{' '}
              <span className="text-gradient">Digital Reality</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 text-white/55 leading-relaxed"
            >
              <p>
                The Virtual Craft is a studio dedicated to building the next
                generation of immersive web experiences. We believe the future
                of the internet is spatial — and we&apos;re building it today.
              </p>
              <p>
                Our team combines deep expertise in WebXR, real-time 3D
                rendering, and spatial design to create experiences that feel
                magical. Whether it&apos;s a virtual showroom, an AR product
                viewer, or a full VR training simulation, we bring visions to
                life.
              </p>
              <p>
                We work at the intersection of creativity and technology,
                using open web standards to make immersive content accessible
                to everyone — no app store, no downloads, just a link.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-500 hover:bg-brand-600 rounded-2xl font-medium transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/25 hover:-translate-y-0.5"
              >
                Work With Us
              </a>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="glass-card p-6 text-center hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={22} className="text-brand-400" />
                </div>
                <div className="font-display text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
