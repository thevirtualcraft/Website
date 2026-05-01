'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, Eye, Maximize2 } from 'lucide-react'

const projects = [
  {
    title: 'Virtual Gallery',
    category: 'WebXR Experience',
    description:
      'Walk through a curated virtual art gallery in your browser. View paintings, sculptures, and installations in immersive 3D space.',
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tags: ['WebXR', 'Three.js', 'Spatial Audio'],
    color: 'from-indigo-500/20 to-purple-500/20',
  },
  {
    title: 'Architectural Walkthrough',
    category: 'Real-time 3D',
    description:
      'Explore architectural designs before they are built. Navigate through rooms, change materials, and experience spaces at real scale.',
    image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tags: ['VR', 'Real-time', 'Interactive'],
    color: 'from-pink-500/20 to-rose-500/20',
  },
  {
    title: 'Product Configurator',
    category: 'Interactive 3D',
    description:
      'Configure and visualize products in AR. Place furniture in your room, customize car colors, and see products from every angle.',
    image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    tags: ['AR', 'E-commerce', 'WebXR'],
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Immersive Training',
    category: 'Enterprise XR',
    description:
      'Hands-on training simulations for industrial, medical, and educational use cases. Learn by doing in risk-free virtual environments.',
    image: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    tags: ['Education', 'Simulation', 'VR'],
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: 'Virtual Event Space',
    category: 'Social XR',
    description:
      'Host conferences, meetups, and social gatherings in custom-designed virtual venues. Support for hundreds of concurrent users.',
    image: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    tags: ['Multiplayer', 'Social', 'Events'],
    color: 'from-pink-500/20 to-yellow-500/20',
  },
  {
    title: 'Data Visualization XR',
    category: 'Spatial Data',
    description:
      'Explore complex datasets in 3D space. Walk through data landscapes, interact with nodes, and discover insights through spatial computing.',
    image: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    tags: ['Data Viz', 'Analytics', 'Spatial'],
    color: 'from-violet-500/20 to-pink-500/20',
  },
]

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="glass-card overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10">
        <div
          className="relative h-52 overflow-hidden"
          style={{ background: project.image }}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 rounded-xl bg-black/40 backdrop-blur-sm hover:bg-black/60 transition">
              <Eye size={16} />
            </button>
            <button className="p-2 rounded-xl bg-black/40 backdrop-blur-sm hover:bg-black/60 transition">
              <Maximize2 size={16} />
            </button>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs font-medium">
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-brand-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Showcase() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  return (
    <section id="showcase" className="relative py-32 section-gradient">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full glass text-sm text-brand-300 font-medium mb-6"
          >
            Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            Immersive{' '}
            <span className="text-gradient">Showcase</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Explore our portfolio of immersive experiences — from virtual
            galleries to enterprise training simulations.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 glass-card hover:bg-white/[0.08] rounded-xl font-medium transition-all hover:-translate-y-0.5 text-brand-300"
          >
            View All Projects <ExternalLink size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
