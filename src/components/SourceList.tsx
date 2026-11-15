import { ExternalLink } from 'lucide-react'
import { isSafeUrl } from '../lib/utils'
import type { Source } from '../types'

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ol className="divide-y divide-line">
      {sources.map((s, i) => (
        <li key={s.id} className="flex items-start gap-4 py-3">
          <span className="font-mono text-sm text-muted">[{i + 1}]</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink">
              {s.author && <span>{s.author} </span>}
              {s.year && <span className="text-muted">({s.year}). </span>}
              <cite className="not-italic">{s.title}</cite>
            </p>
          </div>
          {isSafeUrl(s.url) && s.url !== 'https://' && (
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 text-sm text-data hover:text-lime" aria-label={`Bron openen: ${s.title} (nieuw tabblad)`}>
              Openen <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </li>
      ))}
    </ol>
  )
}
