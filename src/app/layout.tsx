import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'The Virtual Craft — Immersive Experiences & WebXR',
  description:
    'We craft immersive digital experiences using WebXR, 3D, and spatial computing. Explore virtual worlds directly in your browser.',
  keywords: [
    'WebXR',
    'virtual reality',
    'augmented reality',
    'immersive experiences',
    '3D web',
    'spatial computing',
  ],
  openGraph: {
    title: 'The Virtual Craft — Immersive Experiences & WebXR',
    description:
      'We craft immersive digital experiences using WebXR, 3D, and spatial computing.',
    type: 'website',
    url: 'https://thevirtualcraft.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="noise-overlay">{children}</body>
    </html>
  )
}
