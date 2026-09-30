import { AnimatePresence, motion } from 'motion/react'
import { Check, Menu, Moon, Pencil, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { href, type PageId } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../hooks/useToast'
import { cn } from '../lib/utils'
import { DataMenu } from './DataMenu'
import { NAV_ITEMS } from './navigation'
import { Button } from './ui'

function EditToggle({ className }: { className?: string }) {
  const { editMode, setEditMode, cloudEnabled, userEmail, setLoginOpen } = usePortfolio()
  const toast = useToast()
  const where = cloudEnabled ? 'in Supabase' : 'in deze browser'
  return (
    <Button
      variant={editMode ? 'primary' : 'outline'}
      icon={editMode ? Check : Pencil}
      aria-pressed={editMode}
      className={className}
      onClick={() => {
        // Met Supabase mag alleen de ingelogde eigenaar bewerken.
        if (!editMode && cloudEnabled && !userEmail) {
          setLoginOpen(true)
          return
        }
        setEditMode(!editMode)
        toast(editMode ? 'Bewerkmodus uit.' : `Bewerkmodus aan. Wijzigingen worden automatisch opgeslagen ${where}.`, 'info')
      }}
    >
      {editMode ? 'Klaar' : 'Bewerken'}
    </Button>
  )
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const label = theme === 'light' ? 'Donkere modus aanzetten' : 'Lichte modus aanzetten'
  const Icon = theme === 'light' ? Moon : Sun
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-lime/60 hover:text-lime"
    >
      <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.25 }} className="flex">
        <Icon className="size-4" aria-hidden />
      </motion.span>
    </button>
  )
}

export function Header({ current }: { current: PageId }) {
  const { data, editMode } = usePortfolio()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const initials = data.profile.name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur-xl">
      {editMode && <div className="lane h-1 w-full" aria-hidden />}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href={href('home')} className="group flex items-center gap-2.5" aria-label="Naar de homepage">
          <span className="flex size-9 items-center justify-center rounded-lg bg-lime font-display text-lg font-extrabold text-lime-dark transition-transform group-hover:-rotate-6">
            {initials || 'MS'}
          </span>
          <span className="hidden font-display text-xl font-bold tracking-wide whitespace-nowrap uppercase sm:inline lg:hidden 2xl:inline">{data.profile.name}</span>
        </a>

        <nav aria-label="Hoofdnavigatie" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {NAV_ITEMS.filter((i) => i.id !== 'home').map((item) => {
              const active = current === item.id
              return (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm whitespace-nowrap transition-colors xl:px-2.5',
                      active ? 'text-lime' : 'text-muted hover:text-ink',
                    )}
                  >
                    <item.icon className="hidden size-4 2xl:block" aria-hidden />
                    {item.label}
                    {active && (
                      <motion.span layoutId="nav-underline" className="absolute inset-x-2 -bottom-[13px] h-0.5 rounded-full bg-lime" />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:ml-2 lg:flex">
          <ThemeToggle />
          <EditToggle />
          <DataMenu />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <EditToggle className="px-3" />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Menu sluiten' : 'Menu openen'}
            className="flex size-10 items-center justify-center rounded-lg border border-line text-ink"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-line bg-bg lg:hidden"
          >
            <nav aria-label="Mobiele navigatie" className="max-h-[calc(100dvh-4rem)] overflow-y-auto px-4 py-4">
              <ul className="grid grid-cols-2 gap-2">
                {NAV_ITEMS.map((item, i) => {
                  const active = current === item.id
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i }}
                    >
                      <a
                        href={href(item.id)}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-2.5 rounded-xl border px-3 py-3 text-sm font-medium',
                          active ? 'border-lime/50 bg-lime/10 text-lime' : 'border-line bg-surface text-ink',
                        )}
                      >
                        <item.icon className="size-4" aria-hidden />
                        {item.label}
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
              <p className="label mt-6">Gegevens</p>
              <DataMenu inline onAction={() => setOpen(false)} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
