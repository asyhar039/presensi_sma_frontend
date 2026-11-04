import type { LandingPageId, NavItem } from '../types/landing.types'

import { IconMenu2, IconX } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/composite/language-switcher'
import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/class-name'

interface LandingHeaderProps {
  activeSection: LandingPageId
  onNavigate: (id: LandingPageId) => void
  isVisible?: boolean
}

export function LandingHeader({
  activeSection,
  onNavigate,
  isVisible = true,
}: LandingHeaderProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: NavItem[] = [
    { id: 'beranda', label: t('landing.nav.home') },
    { id: 'tentang', label: t('landing.nav.about') },
    { id: 'panduan', label: t('landing.nav.guide') },
    { id: 'pengembang', label: t('landing.nav.team') },
    { id: 'bantuan', label: t('landing.nav.help') },
  ]

  const handleItemClick = (id: LandingPageId) => {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-slate-800/80 dark:bg-slate-950/95',
        isVisible
          ? 'translate-y-0 opacity-100 shadow-md'
          : '-translate-y-full opacity-0 pointer-events-none',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <button
          type="button"
          onClick={() => handleItemClick('beranda')}
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <img
            src="/Logo SIP.svg"
            alt="Logo SIP"
            className="h-10 w-auto object-contain"
          />
        </button>

        {/* Desktop Navigation Links - Modern Capsule / Pill Container */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-100/90 p-1 shadow-inner dark:border-slate-800 dark:bg-slate-900/90">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  'cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition-all duration-200 select-none',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/35 ring-1 ring-blue-500'
                    : 'text-slate-700 hover:bg-white hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400',
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full shadow-md shadow-blue-600/25 transition-transform hover:scale-105"
            >
              {t('landing.nav.dashboard')}
            </Button>
          ) : (
            <Button
              render={<Link to="/login" />}
              nativeButton={false}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-2 rounded-full shadow-md shadow-blue-600/25 transition-transform hover:scale-105"
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
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
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
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 dark:border-slate-800 dark:bg-slate-950 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    'flex items-center justify-between text-left py-2.5 px-4 rounded-xl text-sm font-bold transition-all',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="size-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              )
            })}
            <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {user ? user.name : t('landing.nav.login')}
              </span>
              {user ? (
                <Button
                  render={<Link to="/dashboard" />}
                  nativeButton={false}
                  className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-sm"
                >
                  {t('landing.nav.dashboard')}
                </Button>
              ) : (
                <Button
                  render={<Link to="/login" />}
                  nativeButton={false}
                  className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-sm"
                >
                  {t('landing.nav.login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
