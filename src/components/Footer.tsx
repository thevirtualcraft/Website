'use client'

import { Github, Twitter, Linkedin, Instagram } from 'lucide-react'

const footerLinks = {
  services: [
    { label: 'WebXR Development', href: '#services' },
    { label: '3D Web Experiences', href: '#services' },
    { label: 'Spatial Computing', href: '#services' },
    { label: 'AR Solutions', href: '#services' },
  ],
  company: [
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#showcase' },
    { label: 'Contact', href: '#contact' },
  ],
  social: [
    { label: 'Twitter', href: 'https://twitter.com/thevirtualcraft', icon: Twitter },
    { label: 'GitHub', href: 'https://github.com/thevirtualcraft', icon: Github },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/thevirtualcraft', icon: Linkedin },
    { label: 'Instagram', href: 'https://instagram.com/thevirtualcraft', icon: Instagram },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-display font-bold text-sm">
                  VC
                </span>
              </div>
              <span className="font-display text-lg font-semibold">
                The Virtual<span className="text-brand-400">Craft</span>
              </span>
            </a>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Crafting immersive digital experiences with WebXR, 3D, and spatial
              computing technologies.
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                  aria-label={link.label}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">
              Start a Project
            </h4>
            <p className="text-sm text-white/40 leading-relaxed mb-4">
              Ready to create something immersive? Let&apos;s talk.
            </p>
            <a
              href="#contact"
              className="inline-flex px-5 py-2.5 text-sm font-medium bg-brand-500 hover:bg-brand-600 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/25"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} The Virtual Craft. All rights
            reserved.
          </p>
          <p className="text-sm text-white/20">
            Built with WebXR &amp; Three.js
          </p>
        </div>
      </div>
    </footer>
  )
}
