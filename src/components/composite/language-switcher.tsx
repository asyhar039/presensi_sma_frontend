import { IconLanguage } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/class-name'

const LANGUAGES = [
  { code: 'id', label: '🇮🇩 Indonesia', short: 'ID' },
  { code: 'en', label: '🇬🇧 English', short: 'EN' },
] as const

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const activeCode = (i18n.resolvedLanguage || i18n.language || '')
    .toLowerCase()
    .startsWith('en')
    ? 'en'
    : 'id'
  const currentLang =
    LANGUAGES.find((l) => l.code === activeCode) ?? LANGUAGES[0]

  const handleChange = (code: string) => {
    void i18n.changeLanguage(code)
    try {
      localStorage.setItem('app_language', code)
    } catch {
      // ignore
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'bg-background dark:bg-foreground dark:text-background dark:hover:bg-foreground dark:hover:text-primary inline-flex size-9 items-center justify-center cursor-pointer rounded-full border border-border dark:border-transparent transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
          className,
        )}
        aria-label={currentLang.label}
      >
        <IconLanguage className="size-4" />
        <span className="sr-only">{currentLang.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={cn(
              'cursor-pointer',
              activeCode === lang.code && 'bg-accent font-semibold',
            )}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
