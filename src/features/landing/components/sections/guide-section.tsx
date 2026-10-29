import type { LandingPageId } from '../../types/landing.types'

import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface GuideSectionProps {
  onNavigate: (page: LandingPageId) => void
}

export function GuideSection({ onNavigate }: GuideSectionProps) {
  const { t } = useTranslation()

  return (
    <section id="panduan" className="py-20 lg:py-28 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Decorative Cyan Gradient Bar */}
        <div className="mb-12 h-2 w-48 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" />

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
              onClick={() => onNavigate('tentang')}
              className="inline-flex items-center gap-2 rounded-full border-2 border-blue-500 px-6 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
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
                      src="/image6.svg"
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
                      src="/image7.svg"
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
                      src="/image8.svg"
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
  )
}
