import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/class-name'
import { TEAM_MEMBERS } from '../../constants/team-members'

export function TeamSection() {
  const { t } = useTranslation()

  return (
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
            {t('landing.team.title')} <span className="text-blue-600">SIP</span>
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
  )
}
