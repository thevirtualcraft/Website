'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Glasses,
  Globe,
  Cpu,
  Palette,
  Layers,
  Zap,
  ArrowRight,
} from 'lucide-react'

const services = [
  {
    icon: Glasses,
    title: 'WebXR Development',
    description:
      'Full-stack WebXR applications accessible on any device. No app downloads needed — just open a link and step in.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Globe,
    title: '3D Web Experiences',
    description:
      'Interactive 3D content that runs seamlessly in any browser. Product configurators, virtual tours, and immersive storytelling.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cpu,
    title: 'Spatial Computing',
    description:
      'Applications for Apple Vision Pro, Meta Quest, and next-gen spatial devices. Designed for the future of computing.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Palette,
    title: '3D Design & Assets',
    description:
      'High-fidelity 3D models, environments, and animations optimized for real-time web rendering and XR headsets.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Layers,
    title: 'AR Solutions',
    description:
      'Web-based augmented reality for e-commerce, education, and marketing. See products in your space before you buy.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description:
      'Squeeze every frame out of your 3D content. We optimize meshes, textures, shaders, and rendering pipelines.',
    gradient: 'from-red-500 to-pink-500',
  },
]

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-card p-8 h-full hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/5">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} p-[1px] mb-6`}
        >
          <div className="w-full h-full rounded-2xl bg-surface-dark flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
            <service.icon
              size={24}
              className="text-white/80 group-hover:text-white transition-colors"
            />
          </div>
        </div>

        <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-brand-300 transition-colors">
          {service.title}
        </h3>
        <p className="text-white/45 text-sm leading-relaxed mb-6">
          {service.description}
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors group/link"
        >
          Learn more
          <ArrowRight
            size={14}
            className="group-hover/link:translate-x-1 transition-transform"
          />
        </a>
      </div>
    </motion.div>
  )
}

export function Services() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  return (
    <section id="services" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full glass text-sm text-brand-300 font-medium mb-6"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            Our <span className="text-gradient">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            From concept to launch, we provide end-to-end immersive experience
            development for brands, enterprises, and creators.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
