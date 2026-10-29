import type { LandingPageId } from '../../types/landing.types'

import {
  IconBook2,
  IconHeadset,
  IconInfoCircle,
  IconUsersGroup,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { DotGrid } from '../dot-grid'

interface HeroSectionProps {
  onNavigate: (page: LandingPageId) => void
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-b from-[#0a1840] via-[#0d2156] to-[#122b6c] text-white pt-16 sm:pt-20 md:pt-24 pb-10 md:pb-14"
    >
      {/* Background Texture */}
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
                onClick={() => onNavigate('tentang')}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-md transition-all hover:bg-slate-100 hover:shadow cursor-pointer"
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

        {/* 4 Feature Menu Cards Container */}
        <div className="mt-8 md:mt-10 rounded-3xl bg-[#dce8fd] p-3 sm:p-5 lg:p-6 text-slate-800 shadow-xl dark:bg-slate-900/90 dark:text-slate-100 border border-blue-200/50 dark:border-slate-800">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Menu 1: Tentang SIP */}
            <button
              type="button"
              onClick={() => onNavigate('tentang')}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-200 hover:bg-white/80 hover:shadow-md hover:-translate-y-1 dark:hover:bg-slate-800 cursor-pointer"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <IconInfoCircle className="size-9 stroke-1.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('landing.features.aboutTitle')}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t('landing.features.aboutDesc')}
              </p>
            </button>

            {/* Menu 2: Panduan Penggunaan */}
            <button
              type="button"
              onClick={() => onNavigate('panduan')}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-200 hover:bg-white/80 hover:shadow-md hover:-translate-y-1 dark:hover:bg-slate-800 cursor-pointer"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <IconBook2 className="size-9 stroke-1.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('landing.features.guideTitle')}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t('landing.features.guideDesc')}
              </p>
            </button>

            {/* Menu 3: Profil Pengembang */}
            <button
              type="button"
              onClick={() => onNavigate('pengembang')}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-200 hover:bg-white/80 hover:shadow-md hover:-translate-y-1 dark:hover:bg-slate-800 cursor-pointer"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <IconUsersGroup className="size-9 stroke-1.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('landing.features.teamTitle')}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t('landing.features.teamDesc')}
              </p>
            </button>

            {/* Menu 4: Bantuan */}
            <button
              type="button"
              onClick={() => onNavigate('bantuan')}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-200 hover:bg-white/80 hover:shadow-md hover:-translate-y-1 dark:hover:bg-slate-800 cursor-pointer"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <IconHeadset className="size-9 stroke-1.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('landing.features.helpTitle')}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t('landing.features.helpDesc')}
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
