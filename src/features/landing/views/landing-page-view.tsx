import type { LandingPageId } from '../types/landing.types'

import { useEffect, useState } from 'react'

import { LandingFooter } from '../components/landing-footer'
import { LandingHeader } from '../components/landing-header'
import { AboutSection } from '../components/sections/about-section'
import { GuideSection } from '../components/sections/guide-section'
import { HelpSection } from '../components/sections/help-section'
import { HeroSection } from '../components/sections/hero-section'
import { TeamSection } from '../components/sections/team-section'

const SECTION_IDS: LandingPageId[] = [
  'beranda',
  'tentang',
  'panduan',
  'pengembang',
  'bantuan',
]

export function LandingPageView() {
  const [activeSection, setActiveSection] = useState<LandingPageId>('beranda')
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)

  // Smooth scroll to target section with sticky header offset
  const scrollTo = (id: LandingPageId) => {
    const element = document.getElementById(id)
    if (element) {
      const navOffset = 76
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  // Scroll spy & Header visibility:
  // - Header remains hidden on 'beranda', and only appears when reaching 'tentang' or beyond
  // - Automatically update active navigation item as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollPos = scrollY + 120

      // Reveal header only when scrolled to the 'tentang' section or beyond
      const tentangEl = document.getElementById('tentang')
      if (tentangEl) {
        setIsHeaderVisible(scrollY >= tentangEl.offsetTop - 100)
      } else {
        setIsHeaderVisible(false)
      }

      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const id = SECTION_IDS[i]
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          if (scrollPos >= top) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Fixed Header (Appears on scroll) */}
      <LandingHeader
        activeSection={activeSection}
        onNavigate={scrollTo}
        isVisible={isHeaderVisible}
      />

      {/* Main Single Scroll Content */}
      <main>
        <HeroSection onNavigate={scrollTo} />
        <AboutSection />
        <GuideSection onNavigate={scrollTo} />
        <TeamSection />
        <HelpSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
