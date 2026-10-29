import { IconPhone } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { DotGrid } from '../dot-grid'

export function HelpSection() {
  const { t } = useTranslation()

  return (
    <section id="bantuan" className="py-16 md:py-24 bg-white dark:bg-slate-950">
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
  )
}
