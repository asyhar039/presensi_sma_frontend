import {
  IconClipboardCheck,
  IconQrcode,
  IconStack2,
  IconTarget,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function AboutSection() {
  const { t } = useTranslation()

  return (
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

            {/* Box: Mengapa menggunakan SIP? */}
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
  )
}
