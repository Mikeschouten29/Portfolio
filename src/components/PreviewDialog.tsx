import { Download, ExternalLink, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { isPdfUrl } from '../lib/utils'
import { IconButton } from './ui'

interface PreviewDialogProps {
  open: boolean
  title: string
  url: string
  onClose: () => void
}

const actionClass =
  'inline-flex h-9 items-center gap-1.5 rounded-lg border border-transparent px-2.5 text-sm text-muted transition-colors hover:border-line hover:bg-surface-2 hover:text-lime'

/** Groot venster om een pdf of afbeelding (zoals een poster) in de site te bekijken. */
export function PreviewDialog({ open, title, url, onClose }: PreviewDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="m-auto h-[92dvh] w-[min(96vw,72rem)] max-w-none overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between gap-2 border-b border-line/70 px-3 py-2 sm:px-4">
            <p className="min-w-0 truncate text-sm font-medium">{title}</p>
            <div className="flex shrink-0 items-center gap-1">
              <a href={url} target="_blank" rel="noopener noreferrer" className={actionClass}>
                <ExternalLink className="size-4" aria-hidden />
                <span className="hidden sm:inline">Nieuw tabblad</span>
                <span className="sr-only sm:hidden">Openen in nieuw tabblad</span>
              </a>
              <a href={url} download className={actionClass}>
                <Download className="size-4" aria-hidden />
                <span className="hidden sm:inline">Downloaden</span>
                <span className="sr-only sm:hidden">Downloaden</span>
              </a>
              <IconButton icon={X} label="Sluiten" onClick={onClose} autoFocus />
            </div>
          </header>
          <div className="min-h-0 flex-1 bg-bg">
            {isPdfUrl(url) ? (
              <iframe title={title} src={`${url}#view=FitH&navpanes=0`} className="size-full border-0" />
            ) : (
              <img src={url} alt={title} className="size-full object-contain" />
            )}
          </div>
          <p className="border-t border-line/70 px-4 py-2 text-center text-xs text-muted">
            Zie je niets? Open het bestand dan in een nieuw tabblad of download het.
          </p>
        </div>
      )}
    </dialog>
  )
}
