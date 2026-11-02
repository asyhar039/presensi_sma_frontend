import { useTranslation } from 'react-i18next'

export function LandingFooter() {
  const { t } = useTranslation()

  return (
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
  )
}
