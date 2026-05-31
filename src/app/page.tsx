'use client'

import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Showcase } from '@/components/Showcase'
import { WebXRViewer } from '@/components/WebXRViewer'
import { Services } from '@/components/Services'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <Showcase />
      <WebXRViewer />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
