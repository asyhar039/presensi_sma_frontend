import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconBooks,
  IconCircleCheck,
  IconClipboardCheck,
  IconMenu2,
  IconPhone,
  IconQrcode,
  IconReport,
  IconStack2,
  IconTarget,
  IconUsers,
  IconX,
} from '@tabler/icons-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/composite/language-switcher'
import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/class-name'

export const Route = createFileRoute('/')({
  component: LandingPageView,
})

const TEAM_MEMBERS = [
  {
    name: 'Abdur Rohim',
    image: '/Abdur Rohim.svg',
    badges: [
      { text: 'Ketua', variant: 'light' },
      { text: 'Front End Developer', variant: 'dark' },
    ],
    description:
      'Memimpin koordinasi proyek secara keseluruhan; mengembangkan antarmuka pengguna (front-end) aplikasi.',
  },
  {
    name: 'Robertus Adi Setiawan',
    image: '/Robertus Adi Setiawan.svg',
    badges: [
      { text: 'Wakil Ketua', variant: 'light' },
      { text: 'DevOps', variant: 'dark' },
    ],
    description:
      'Mendampingi ketua dalam pengambilan keputusan; mengelola infrastruktur dan proses deployment aplikasi.',
  },
  {
    name: 'Triana Elisabet Sinaga',
    image: '/Triana Elisabet Sinaga.svg',
    badges: [{ text: 'Sekretaris', variant: 'light' }],
    description: 'Mendokumentasikan hasil diskusi dan perkembangan proyek.',
  },
  {
    name: 'Siti Munfarida',
    image: '/Siti Munfarida.svg',
    badges: [{ text: 'Bendahara', variant: 'light' }],
    description: 'Mengelola kebutuhan anggaran dan pencatatan keuangan proyek.',
  },
  {
    name: 'Ashar Qowim',
    image: '/Ashar Qowim.svg',
    badges: [
      { text: 'Tim Teknis', variant: 'light' },
      { text: 'DevOps', variant: 'dark' },
    ],
    description:
      'Mendukung pengelolaan infrastruktur dan proses deployment aplikasi.',
  },
  {
    name: 'Maswa Arbaurnika',
    image: '/Maswa Arbaurnika.svg',
    badges: [
      { text: 'Tim Teknis', variant: 'light' },
      { text: 'Back End Developer', variant: 'dark' },
    ],
    description:
      'Mengembangkan sistem back-end, basis data, dan logika presensi berbasis QR Code.',
  },
  {
    name: 'Resa Martyaningsih',
    image: '/Resa Martyaningsih.svg',
    badges: [
      { text: 'Tim Teknis', variant: 'light' },
      { text: 'UI/UX', variant: 'dark' },
    ],
    description:
      'Merancang alur dan tampilan antarmuka aplikasi agar mudah digunakan oleh guru dan siswa.',
  },
  {
    name: 'Septania Salihati',
    image: '/Septania Salihati.svg',
    badges: [
      { text: 'Tim Teknis', variant: 'light' },
      { text: 'UI/UX', variant: 'dark' },
    ],
    description:
      'Merancang alur dan tampilan antarmuka aplikasi agar mudah digunakan oleh guru dan siswa.',
  },
]

function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-8 gap-3 opacity-30 select-none pointer-events-none',
        className,
      )}
    >
      {Array.from({ length: 32 }).map((_, i) => (
        <span key={`dot-${i}`} className="size-1.5 rounded-full bg-cyan-300" />
      ))}
    </div>
  )
}

export function LandingPageView() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('beranda')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'beranda', label: t('landing.nav.home') },
    { id: 'panduan', label: t('landing.nav.guide') },
    { id: 'tentang', label: t('landing.nav.about') },
    { id: 'pengembang', label: t('landing.nav.team') },
    { id: 'bantuan', label: t('landing.nav.help') },
  ]

  // Smooth scroll to target section with sticky header offset
  const scrollTo = (id: string) => {
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
    setMobileMenuOpen(false)
  }

  // Scroll spy: automatically update active navigation item as user scrolls
  useEffect(() => {
    const sectionIds = [
      'beranda',
      'tentang',
      'panduan',
      'pengembang',
      'bantuan',
    ]

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
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
      {/* =========================================================================
          Sticky Navbar
      ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo SIP */}
          <button
            type="button"
            onClick={() => scrollTo('beranda')}
            className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
          >
            <img
              src="/Logo SIP.svg"
              alt="Logo SIP"
              className="h-10 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    'cursor-pointer transition-colors duration-200',
                    isActive
                      ? 'text-blue-600 font-semibold dark:text-blue-400'
                      : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400',
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Action Button & Utilities */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            {user ? (
              <Button
                render={<Link to="/dashboard" />}
                nativeButton={false}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm"
              >
                {t('landing.nav.dashboard')}
              </Button>
            ) : (
              <Button
                render={<Link to="/login" />}
                nativeButton={false}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-7 py-2 rounded-lg shadow-sm"
              >
                {t('landing.nav.login')}
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? (
                <IconX className="size-6" />
              ) : (
                <IconMenu2 className="size-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 dark:border-slate-800 dark:bg-slate-950 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    'text-left py-2 px-3 rounded-md text-sm font-medium transition-colors',
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 font-semibold dark:bg-blue-950/50 dark:text-blue-400'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900',
                  )}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {user ? (
                  <Button
                    render={<Link to="/dashboard" />}
                    nativeButton={false}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                  >
                    {t('landing.nav.dashboard')}
                  </Button>
                ) : (
                  <Button
                    render={<Link to="/login" />}
                    nativeButton={false}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                  >
                    {t('landing.nav.login')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          Section 1: Beranda (Hero Section)
      ========================================================================= */}
      <section
        id="beranda"
        className="relative overflow-hidden bg-gradient-to-b from-[#0a1840] via-[#0d2156] to-[#122b6c] text-white pt-16 pb-20 md:pb-28"
      >
        {/* Background Texture from public/latar main sip.svg */}
        <img
          src="/latar main sip.svg"
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-20"
        />

        {/* Top Decorative Dot Matrix */}
        <DotGrid className="absolute top-8 left-1/2 -translate-x-1/2 hidden md:grid" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 backdrop-blur-sm uppercase">
                {t('landing.hero.badge')}
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                  {t('landing.hero.title')}
                </h1>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  {t('landing.hero.subtitle')}{' '}
                  <span className="text-emerald-400 font-extrabold">
                    {t('landing.hero.subtitleHighlight')}
                  </span>
                </h2>
                <p className="text-lg font-medium text-slate-200 pt-1">
                  {t('landing.hero.tagline')}
                </p>
              </div>

              {/* Subtitle */}
              <p className="max-w-xl text-sm leading-relaxed text-slate-300">
                {t('landing.hero.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  render={<Link to={user ? '/dashboard' : '/login'} />}
                  nativeButton={false}
                  className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  {t('landing.hero.ctaStart')} &rarr;
                </Button>

                <button
                  type="button"
                  onClick={() => scrollTo('tentang')}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-md transition-all hover:bg-slate-100 hover:shadow"
                >
                  {t('landing.hero.ctaLearn')} &rarr;
                </button>
              </div>
            </div>

            {/* Right Hero Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <div className="relative flex items-center justify-center">
                {/* Subtle Glow Backdrop */}
                <div className="absolute size-72 sm:size-96 rounded-full bg-blue-500/20 blur-3xl" />
                <img
                  src="/Main SIP.svg"
                  alt="SIP 3D Ribbon Logo"
                  className="relative z-10 w-full max-w-sm sm:max-w-md object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* 4 Feature Highlight Cards Container */}
          <div className="mt-14 md:mt-20 rounded-3xl bg-[#dce8fd] p-4 sm:p-6 lg:p-8 text-slate-800 shadow-xl dark:bg-slate-900/90 dark:text-slate-100 border border-blue-200/50 dark:border-slate-800">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-3">
                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl text-blue-700 dark:text-blue-400">
                  <IconQrcode className="size-9 stroke-1.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('landing.features.qrTitle')}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('landing.features.qrDesc')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-3">
                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl text-blue-700 dark:text-blue-400">
                  <IconBooks className="size-9 stroke-1.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('landing.features.recapTitle')}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('landing.features.recapDesc')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-3">
                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl text-blue-700 dark:text-blue-400">
                  <IconReport className="size-9 stroke-1.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('landing.features.reportTitle')}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('landing.features.reportDesc')}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center p-3">
                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl text-blue-700 dark:text-blue-400">
                  <IconUsers className="size-9 stroke-1.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('landing.features.accessTitle')}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('landing.features.accessDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Section 2: Tentang SIP
      ========================================================================= */}
      <section
        id="tentang"
        className="relative overflow-hidden py-20 lg:py-28 bg-white dark:bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Description & "Mengapa Menggunakan SIP?" Box */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-5">
              <span className="rounded-full bg-sky-400 px-4 py-1 text-xs font-semibold text-white shadow-xs">
                {t('landing.about.badge')}
              </span>

              {/* Heading */}
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                {t('landing.about.title')}{' '}
                <span className="text-blue-600">SIP</span>
              </h2>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {t('landing.about.description')}
              </p>

              {/* Box: Mengapa menggunakan SIP? (from user reference image) */}
              <div className="w-full mt-4 rounded-2xl border border-sky-200 bg-[#e0f4fc] p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
                <h3 className="text-base font-bold text-sky-950 dark:text-sky-100 mb-4">
                  {t('landing.about.whyTitle')}
                </h3>

                {/* 3 Cards: Praktis, Terintegrasi, Terstruktur */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card 1: Praktis */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center shadow-xs dark:bg-slate-800 border border-sky-100 dark:border-slate-700">
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg text-sky-600 dark:text-sky-400">
                      <IconQrcode className="size-7 stroke-2" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('landing.about.card1Title')}
                    </span>
                    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {t('landing.about.card1Desc')}
                    </span>
                  </div>

                  {/* Card 2: Terintegrasi */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center shadow-xs dark:bg-slate-800 border border-sky-100 dark:border-slate-700">
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg text-sky-600 dark:text-sky-400">
                      <IconStack2 className="size-7 stroke-2" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('landing.about.card2Title')}
                    </span>
                    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {t('landing.about.card2Desc')}
                    </span>
                  </div>

                  {/* Card 3: Terstruktur */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center shadow-xs dark:bg-slate-800 border border-sky-100 dark:border-slate-700">
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg text-sky-600 dark:text-sky-400">
                      <IconClipboardCheck className="size-7 stroke-2" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('landing.about.card3Title')}
                    </span>
                    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {t('landing.about.card3Desc')}
                    </span>
                  </div>
                </div>

                {/* Tujuan SIP */}
                <div className="mt-4 flex items-start gap-3 pt-1">
                  <div className="flex size-7 shrink-0 items-center justify-center text-sky-600 dark:text-sky-400">
                    <IconTarget className="size-6 stroke-2" />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {t('landing.about.goalTitle')}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {t('landing.about.goalDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Computer and Overlapping Phones Mockups */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center w-full self-center pt-8 lg:pt-0">
              <div className="relative w-full max-w-xl lg:max-w-2xl pb-10">
                {/* Absen dulu yukk SVG in original position */}
                <div className="flex justify-end pr-2 sm:pr-4 mb-3">
                  <img
                    src="/absenduluyuk.svg"
                    alt="Absen dulu yukk!!"
                    className="h-14 sm:h-16 md:h-20 w-auto object-contain select-none"
                  />
                </div>

                {/* Laptop + Phones Composite shifted slightly left towards the left card */}
                <div className="relative w-full lg:-translate-x-15 xl:-translate-x-19 transition-transform">
                  {/* Laptop */}
                  <img
                    src="/Komputer%20tentang%20sip.png"
                    alt="Komputer SIP"
                    className="w-full object-contain drop-shadow-2xl"
                  />
                  {/* Two Phones overlapping bottom-right of laptop */}
                  <div className="absolute -bottom-8 -right-3 sm:-bottom-10 sm:-right-6 w-36 sm:w-48 md:w-56 lg:w-60 z-20">
                    <img
                      src="/phone%20tentang%20sip.png"
                      alt="Ponsel SIP"
                      className="w-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Cyan Gradient Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-2 w-48 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" />
      </div>

      {/* =========================================================================
          Section 3: Panduan Penggunaan
      ========================================================================= */}
      <section
        id="panduan"
        className="py-20 lg:py-28 bg-white dark:bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Heading & Info */}
            <div className="lg:col-span-5 flex flex-col items-start space-y-5">
              <span className="rounded-full bg-sky-400 px-4 py-1 text-xs font-semibold text-white shadow-xs">
                {t('landing.guide.badge')}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                {t('landing.guide.title')}{' '}
                <span className="text-blue-600">
                  {t('landing.guide.titleHighlight')}
                </span>
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {t('landing.guide.description')}
              </p>
              <button
                type="button"
                onClick={() => scrollTo('tentang')}
                className="inline-flex items-center gap-2 rounded-full border-2 border-blue-500 px-6 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                {t('landing.guide.learnMore')} &rarr;
              </button>
            </div>

            {/* Right Column: 2x2 Step Flow with Arrows */}
            <div className="lg:col-span-7">
              <div className="relative mx-auto max-w-xl">
                <div className="grid grid-cols-2 gap-x-10 gap-y-12">
                  {/* Step 1: Scan QR */}
                  <div className="relative flex flex-col items-center text-center space-y-2">
                    <span className="absolute -top-3 left-4 flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow">
                      1
                    </span>
                    <div className="flex h-20 w-20 items-center justify-center">
                      <img
                        src="/image 6.svg"
                        alt="Scan QR Code"
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {t('landing.guide.step1Title')}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-[180px]">
                      {t('landing.guide.step1Desc')}
                    </p>

                    {/* Connecting Arrow (Step 1 -> Step 2) */}
                    <div className="hidden sm:flex absolute -right-6 top-10 text-slate-400">
                      <IconArrowRight className="size-6 stroke-1.5" />
                    </div>
                  </div>

                  {/* Step 2: Ajukan Izin */}
                  <div className="relative flex flex-col items-center text-center space-y-2">
                    <span className="absolute -top-3 left-4 flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow">
                      2
                    </span>
                    <div className="flex h-20 w-20 items-center justify-center">
                      <img
                        src="/image 7.svg"
                        alt="Ajukan Izin"
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {t('landing.guide.step2Title')}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-[180px]">
                      {t('landing.guide.step2Desc')}
                    </p>

                    {/* Connecting Arrow (Step 2 -> Step 3) */}
                    <div className="hidden sm:flex absolute right-1/2 translate-x-1/2 -bottom-8 text-slate-400">
                      <IconArrowDown className="size-6 stroke-1.5" />
                    </div>
                  </div>

                  {/* Step 4: Selesai */}
                  <div className="relative flex flex-col items-center text-center space-y-2">
                    <span className="absolute -top-3 left-4 flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow">
                      4
                    </span>
                    <div className="flex h-20 w-20 items-center justify-center">
                      <IconCircleCheck className="size-16 text-blue-600 stroke-1.5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {t('landing.guide.step4Title')}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-[180px]">
                      {t('landing.guide.step4Desc')}
                    </p>
                  </div>

                  {/* Step 3: Cek Riwayat */}
                  <div className="relative flex flex-col items-center text-center space-y-2">
                    <span className="absolute -top-3 left-4 flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow">
                      3
                    </span>
                    <div className="flex h-20 w-20 items-center justify-center">
                      <img
                        src="/image 8.svg"
                        alt="Cek Riwayat"
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {t('landing.guide.step3Title')}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-[180px]">
                      {t('landing.guide.step3Desc')}
                    </p>

                    {/* Connecting Arrow (Step 3 -> Step 4) */}
                    <div className="hidden sm:flex absolute -left-6 top-10 text-slate-400">
                      <IconArrowLeft className="size-6 stroke-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Section 4: Profil Tim Pengembang
      ========================================================================= */}
      <section
        id="pengembang"
        className="py-20 lg:py-28 bg-[#f1f7fe] dark:bg-slate-900/60"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-4 mb-14">
            <span className="rounded-full bg-sky-400 px-4 py-1 text-xs font-semibold text-white shadow-xs">
              {t('landing.team.badge')}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {t('landing.team.title')}{' '}
              <span className="text-blue-600">SIP</span>
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('landing.team.description')}
            </p>
          </div>

          {/* Team Cards Grid (Row 1: 3, Row 2: 3, Row 3: 2 centered) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.slice(0, 6).map((member) => (
              <div
                key={member.name}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar with blue ring */}
                  <div className="size-16 shrink-0 overflow-hidden rounded-full border-2 border-blue-500 p-0.5 bg-blue-50">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="size-full object-cover rounded-full"
                    />
                  </div>
                  {/* Name & Badges */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {member.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {member.badges.map((b) => (
                        <span
                          key={b.text}
                          className={cn(
                            'text-[10px] font-semibold px-2.5 py-0.5 rounded-full',
                            b.variant === 'light'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
                              : 'bg-blue-600 text-white',
                          )}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {member.description}
                </p>
              </div>
            ))}
          </div>

          {/* Row 3: 2 Centered Cards */}
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-6">
            {TEAM_MEMBERS.slice(6, 8).map((member) => (
              <div
                key={member.name}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 w-full md:max-w-md"
              >
                <div className="flex items-center gap-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-full border-2 border-blue-500 p-0.5 bg-blue-50">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="size-full object-cover rounded-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {member.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {member.badges.map((b) => (
                        <span
                          key={b.text}
                          className={cn(
                            'text-[10px] font-semibold px-2.5 py-0.5 rounded-full',
                            b.variant === 'light'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
                              : 'bg-blue-600 text-white',
                          )}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          Section 5: Bantuan
      ========================================================================= */}
      <section
        id="bantuan"
        className="py-16 md:py-24 bg-white dark:bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1d49] via-[#0f235b] to-[#122a6c] px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 lg:px-16">
            {/* Decorative Dot Grids */}
            <DotGrid className="absolute -bottom-2 right-12 hidden lg:grid opacity-25" />
            <DotGrid className="absolute -top-4 right-1/3 hidden lg:grid opacity-15" />

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
              {/* Left Column Content */}
              <div className="lg:col-span-7 flex flex-col items-start space-y-4">
                <span className="rounded-full bg-sky-400 px-4 py-1 text-xs font-semibold text-white shadow-xs">
                  {t('landing.help.badge')}
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                  {t('landing.help.title')}
                </h2>
                <p className="max-w-md text-xs sm:text-sm leading-relaxed text-slate-200">
                  {t('landing.help.description')}
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:support@presensi.sch.id"
                    className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-blue-700 shadow-md transition-all hover:bg-slate-100"
                  >
                    {t('landing.help.contactUs')}
                    <IconPhone className="size-5" />
                  </a>
                </div>
              </div>

              {/* Right Column 3D Rings Graphic */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative flex items-center justify-center opacity-85">
                  <div className="size-48 sm:size-56 rounded-full border-12 border-blue-400/40 rotate-12 shadow-2xl" />
                  <div className="absolute size-36 sm:size-44 rounded-full border-10 border-cyan-400/50 -rotate-12 shadow-inner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Footer: Support by & Copyright
      ========================================================================= */}
      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8 text-xs text-slate-600 dark:text-slate-400">
          {/* Support By Logos */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {t('landing.footer.supportBy')}
            </span>
            <div className="flex items-center gap-3">
              <img
                src="/Logo UNY 1.svg"
                alt="Logo Universitas Negeri Yogyakarta"
                className="h-10 w-auto object-contain"
              />
              <img
                src="/image 22.svg"
                alt="Logo PPG UNY"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          {/* Copyright Text */}
          <div className="text-center font-medium">
            {t('landing.footer.copyright')}
          </div>

          {/* Right SIP Logo */}
          <div className="flex items-center">
            <img
              src="/Logo SIP.svg"
              alt="Logo SIP Footer"
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
