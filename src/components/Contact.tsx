'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Mail, MapPin, ArrowUpRight } from 'lucide-react'

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="contact" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full glass text-sm text-brand-300 font-medium mb-6"
            >
              Get in Touch
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl font-bold mb-6"
            >
              Let&apos;s Build Something{' '}
              <span className="text-gradient">Extraordinary</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/50 text-lg mb-10 leading-relaxed"
            >
              Have a project in mind? We&apos;d love to hear about it. Tell us
              your vision and we&apos;ll craft an immersive experience that
              brings it to life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <a
                href="mailto:hello@thevirtualcraft.com"
                className="flex items-center gap-4 p-4 glass-card hover:border-white/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Mail size={20} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-sm text-white/40 mb-0.5">Email</div>
                  <div className="text-white/80 group-hover:text-brand-300 transition-colors">
                    hello@thevirtualcraft.com
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="ml-auto text-white/20 group-hover:text-brand-400 transition-colors"
                />
              </a>
              <div className="flex items-center gap-4 p-4 glass-card">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <MapPin size={20} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-sm text-white/40 mb-0.5">Location</div>
                  <div className="text-white/80">Remote — Worldwide</div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 glow-border">
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-white/50 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-white/50 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="project-type"
                    className="block text-sm text-white/50 mb-2"
                  >
                    Project Type
                  </label>
                  <select
                    id="project-type"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 transition-all appearance-none"
                  >
                    <option value="">Select a project type</option>
                    <option value="webxr">WebXR Experience</option>
                    <option value="3d-web">3D Web Application</option>
                    <option value="ar">AR Solution</option>
                    <option value="vr">VR Application</option>
                    <option value="spatial">Spatial Computing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-white/50 mb-2"
                  >
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="Describe your vision..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 hover:bg-brand-600 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25 disabled:opacity-50"
                  disabled={submitted}
                >
                  {submitted ? (
                    'Thank you! We\'ll be in touch.'
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
