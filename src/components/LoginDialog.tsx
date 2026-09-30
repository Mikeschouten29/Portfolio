import { KeyRound, LogIn, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { usePortfolio } from '../hooks/usePortfolio'
import { useToast } from '../hooks/useToast'
import { Button, IconButton } from './ui'

/** Inloggen voor de eigenaar: alleen ingelogd worden wijzigingen in Supabase opgeslagen. */
export function LoginDialog() {
  const { loginOpen, setLoginOpen, signIn, setEditMode } = usePortfolio()
  const toast = useToast()
  const ref = useRef<HTMLDialogElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (loginOpen && !dialog.open) dialog.showModal()
    if (!loginOpen && dialog.open) dialog.close()
  }, [loginOpen])

  const close = () => {
    setLoginOpen(false)
    setPassword('')
    setError(null)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      toast('Ingelogd. Je wijzigingen worden nu in Supabase opgeslagen.')
      setEditMode(true)
      close()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inloggen is mislukt.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      aria-labelledby="login-title"
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex size-11 items-center justify-center rounded-xl bg-lime/10 text-lime">
            <KeyRound className="size-5" aria-hidden />
          </div>
          <IconButton icon={X} label="Sluiten" onClick={close} />
        </div>
        <h2 id="login-title" className="text-2xl font-bold uppercase">
          Inloggen om te bewerken
        </h2>
        <p className="mt-1 text-sm text-muted">Alleen de eigenaar van dit portfolio kan wijzigingen opslaan.</p>

        <label htmlFor="login-email" className="label mt-5">
          E-mailadres
        </label>
        <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />

        <label htmlFor="login-password" className="label mt-4">
          Wachtwoord
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
        />

        {error && (
          <p role="alert" className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" icon={LogIn} disabled={busy} className="mt-6 w-full">
          {busy ? 'Bezig met inloggen…' : 'Inloggen'}
        </Button>
      </form>
    </dialog>
  )
}
