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
  Check,
  type LucideIcon,
} from 'lucide-react'
import { ServiceGraphic, type ServiceGraphicId } from './ServiceGraphic'

type Service = {
  icon: LucideIcon
  graphic: ServiceGraphicId
  eyebrow: string
  title: string
  description: string
  features: string[]
  metric: { value: string; label: string }
  gradient: string
}

const services: Service[] = [
  {
    icon: Glasses,
    graphic: 'webxr',
    eyebrow: 'Immersive apps',
    title: 'WebXR Development',
    description:
      'Full-stack WebXR applications that run on VR headsets, AR glasses, and everyday phones — straight from a URL. No app store, no installs, no friction. We handle scene graphs, controller input, hand tracking, and session management so your users just click a link and step inside.',
    features: [
      'Cross-device: Quest, Vision Pro, and mobile',
      'Hand & controller input with haptics',
      'Multiplayer & shared spatial sessions',
      'Progressive fallback for non-XR browsers',
    ],
    metric: { value: '0', label: 'installs required' },
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Globe,
    graphic: 'web3d',
    eyebrow: 'Real-time 3D',
    title: '3D Web Experiences',
    description:
      'Interactive 3D content that runs seamlessly in any browser tab. From product configurators and virtual tours to immersive brand storytelling, we build GPU-accelerated scenes that stay smooth on laptops and phones alike.',
    features: [
      'Product configurators with live materials',
      'Virtual tours & 360° environments',
      'Scroll-driven cinematic storytelling',
      'CMS-friendly, updatable content',
    ],
    metric: { value: '60fps', label: 'target framerate' },
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cpu,
    graphic: 'spatial',
    eyebrow: 'Next-gen devices',
    title: 'Spatial Computing',
    description:
      'Applications designed for Apple Vision Pro, Meta Quest, and the next wave of spatial devices. We design around depth, gaze, and gesture — building interfaces that feel native to a world without screens.',
    features: [
      'Gaze + pinch and gesture interaction',
      'Depth-aware, room-scale layouts',
      'Persistent anchors & world understanding',
      'Comfort-first UX to avoid fatigue',
    ],
    metric: { value: '3D', label: 'native interfaces' },
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Palette,
    graphic: 'design',
    eyebrow: 'Assets & art',
    title: '3D Design & Assets',
    description:
      'High-fidelity 3D models, environments, and animations, optimized for real-time web rendering and XR headsets. We sweat the polycount, bake the lighting, and compress the textures so your art looks stunning and loads fast.',
    features: [
      'Optimized meshes & LODs for the web',
      'PBR materials & baked lighting',
      'Rigged, animated, and interaction-ready',
      'Draco / KTX2 compression pipeline',
    ],
    metric: { value: '4K', label: 'textures, web-ready' },
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Layers,
    graphic: 'ar',
    eyebrow: 'Augmented reality',
    title: 'AR Solutions',
    description:
      'Web-based augmented reality for e-commerce, education, and marketing. Let customers place products in their own space, visualize scale, and try before they buy — all without downloading anything.',
    features: [
      'Place-in-your-room product previews',
      'Marker & marker-less tracking',
      'Shopify / e-commerce integrations',
      'QR-to-AR activation for print & retail',
    ],
    metric: { value: '1 tap', label: 'to launch in AR' },
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    graphic: 'performance',
    eyebrow: 'Optimization',
    title: 'Performance Optimization',
    description:
      'We squeeze every frame out of your 3D content. From draw-call batching and shader tuning to texture atlasing and streaming, we make heavy scenes feel effortless on mid-range hardware.',
    features: [
      'Draw-call batching & instancing',
      'Shader & material optimization',
      'Asset streaming & lazy loading',
      'Profiling with real-device metrics',
    ],
    metric: { value: '90+', label: 'Lighthouse target' },
    gradient: 'from-red-500 to-pink-500',
  },
]

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reversed = index % 2 === 1
  const Icon = service.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center"
    >
      {/* Graphic panel */}
      <div className={reversed ? 'lg:order-2' : ''}>
        <div className="glass-card glow-border relative aspect-[6/5] sm:aspect-[16/9] lg:aspect-[6/5] overflow-hidden">
          <div className="absolute inset-0 grid-backdrop opacity-60" />
          <div
            className={`absolute -inset-10 bg-gradient-to-br ${service.gradient} opacity-[0.08] blur-2xl`}
          />
          <div className="relative w-full h-full p-6">
            <ServiceGraphic id={service.graphic} />
          </div>
          <div className="absolute bottom-4 right-5 text-right">
            <div className="font-display text-2xl font-bold text-gradient">
              {service.metric.value}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-white/40">
              {service.metric.label}
            </div>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <div className={reversed ? 'lg:order-1' : ''}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} p-[1px]`}
          >
            <div className="w-full h-full rounded-2xl bg-surface-dark flex items-center justify-center">
              <Icon size={22} className="text-white/90" />
            </div>
          </div>
          <span className="text-xs uppercase tracking-widest text-brand-300/80 font-medium">
            {service.eyebrow}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4">
          {service.title}
        </h3>
        <p className="text-white/55 leading-relaxed mb-7">
          {service.description}
        </p>

        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
              <span
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center`}
              >
                <Check size={12} className="text-white" strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-300 hover:text-brand-200 transition-colors group/link"
        >
          Discuss your project
          <ArrowRight
            size={15}
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
    <section id="services" className="relative py-32 section-gradient">
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
            Our <span className="text-gradient">Services</span>, in depth
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            From concept to launch, we provide end-to-end immersive experience
            development for brands, enterprises, and creators. Here is exactly
            what each capability delivers.
          </motion.p>
        </div>

        <div className="flex flex-col gap-24">
          {services.map((service, i) => (
            <ServiceRow key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
