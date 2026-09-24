import { ArrowUp, Save } from 'lucide-react'
import { href } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { NAV_ITEMS } from './navigation'

export function Footer() {
  const { data } = usePortfolio()
  return (
    <footer className="mt-16 border-t border-line bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_2fr_auto]">
        <div>
          <p className="font-display text-3xl font-extrabold uppercase">{data.profile.name}</p>
          <p className="mt-1 text-sm text-muted">Sport · AI · Data. Minor {data.profile.minor}</p>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
            <Save className="size-3.5" aria-hidden /> Wijzigingen worden automatisch opgeslagen in deze browser.
          </p>
        </div>
        <nav aria-label="Footernavigatie">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={href(item.id)} className="text-muted hover:text-lime">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1.5 self-start rounded-lg border border-line px-3 py-2 text-sm text-muted hover:border-lime/60 hover:text-lime"
        >
          <ArrowUp className="size-4" aria-hidden /> Naar boven
        </button>
      </div>
      <p className="border-t border-line/60 py-4 text-center font-mono text-[11px] text-muted">
        © {new Date().getFullYear()} {data.profile.name}
      </p>
    </footer>
  )
}
