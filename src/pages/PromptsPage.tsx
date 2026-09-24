import { AnimatePresence, motion } from 'motion/react'
import { Bot, Copy, Library, Link2, Plus, Search, SearchX, Tag, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { EditableList, EditableText, Field } from '../components/editable'
import { PageHeader } from '../components/PageHeader'
import { Badge, Button, EmptyState, IconButton } from '../components/ui'
import { useCopy } from '../hooks/useCopy'
import { usePortfolio } from '../hooks/usePortfolio'
import { useToast } from '../hooks/useToast'
import { cn, pageUrl, uid } from '../lib/utils'
import { LU_IDS, type LuId, type Prompt } from '../types'

function composePrompt(p: Prompt): string {
  return [`Rol: ${p.role}`, `Context: ${p.context}`, `Taak: ${p.task}`, `Output: ${p.output}`].join('\n\n')
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        active ? 'border-lime bg-lime text-lime-dark' : 'border-line text-muted hover:border-lime/50 hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

function PromptCard({ prompt, highlighted, onTag }: { prompt: Prompt; highlighted: boolean; onTag: (tag: string) => void }) {
  const { editMode, update, data } = usePortfolio()
  const copy = useCopy()
  const toast = useToast()
  const patch = (changes: Partial<Prompt>) =>
    update((d) => {
      const p = d.prompts.find((x) => x.id === prompt.id)
      if (p) Object.assign(p, changes)
    })

  const toggleLu = (id: LuId) =>
    patch({
      learningOutcomes: prompt.learningOutcomes.includes(id)
        ? prompt.learningOutcomes.filter((l) => l !== id)
        : [...prompt.learningOutcomes, id].sort(),
    })

  const parts: Array<{ key: 'role' | 'context' | 'task' | 'output'; label: string }> = [
    { key: 'role', label: 'Rol' },
    { key: 'context', label: 'Context' },
    { key: 'task', label: 'Taak' },
    { key: 'output', label: 'Output' },
  ]

  return (
    <motion.li
      layout
      id={`prompt-${prompt.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'flex scroll-mt-24 flex-col rounded-2xl border bg-surface/80 p-5 sm:p-6',
        highlighted ? 'border-lime shadow-[0_0_0_4px_rgb(200_245_66/0.12)]' : 'border-line',
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {editMode ? (
          <input
            className="field w-auto py-1 text-sm"
            value={prompt.category}
            aria-label="Categorie"
            placeholder="Categorie"
            onChange={(e) => patch({ category: e.target.value })}
          />
        ) : (
          <Badge tone="data">{prompt.category}</Badge>
        )}
        {editMode
          ? LU_IDS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={prompt.learningOutcomes.includes(id)}
                onClick={() => toggleLu(id)}
                className={cn(
                  'rounded-md border px-2 py-0.5 font-mono text-[11px]',
                  prompt.learningOutcomes.includes(id) ? 'border-lime bg-lime/15 text-lime' : 'border-line text-muted',
                )}
              >
                {id}
              </button>
            ))
          : prompt.learningOutcomes.map((id) => (
              <Badge key={id} tone="lime">
                <span title={data.learningOutcomes.find((l) => l.id === id)?.title}>{id}</span>
              </Badge>
            ))}
        <div className="ml-auto flex items-center">
          <IconButton icon={Link2} label="Directe link naar deze prompt kopiëren" onClick={() => copy(pageUrl(`prompts/${prompt.id}`), 'Link naar prompt gekopieerd')} />
          {editMode && (
            <IconButton
              icon={Trash2}
              tone="danger"
              label="Prompt verwijderen"
              onClick={() => {
                update((d) => void (d.prompts = d.prompts.filter((p) => p.id !== prompt.id)))
                toast('Prompt verwijderd', 'info')
              }}
            />
          )}
        </div>
      </div>

      <EditableText as="h3" value={prompt.title} onChange={(v) => patch({ title: v })} label="Titel van de prompt" className="text-2xl leading-tight font-bold uppercase" inputClassName="font-display text-xl font-bold" />

      <div className="mt-4 space-y-3 border-l-2 border-line pl-4">
        {parts.map(({ key, label }) => (
          <Field key={key} label={label}>
            <EditableText value={prompt[key]} onChange={(v) => patch({ [key]: v })} label={label} multiline rows={2} className="text-sm text-ink/90" />
          </Field>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="AI-tools">
          {editMode ? (
            <EditableList items={prompt.tools} onChange={(tools) => patch({ tools })} label="AI-tool" addLabel="Tool toevoegen" />
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {prompt.tools.map((t) => (
                <li key={t} className="flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-xs text-ink">
                  <Bot className="size-3.5 text-data" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          )}
        </Field>
        <Field label="Tags">
          {editMode ? (
            <EditableList items={prompt.tags} onChange={(tags) => patch({ tags })} label="Tag" addLabel="Tag toevoegen" />
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {prompt.tags.map((t) => (
                <li key={t}>
                  <button type="button" onClick={() => onTag(t)} className="font-mono text-xs text-muted hover:text-lime">
                    #{t}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Field>
      </div>

      <div className="mt-auto pt-5">
        <Button variant="primary" icon={Copy} className="w-full" onClick={() => copy(composePrompt(prompt), 'Prompt gekopieerd, klaar om te plakken')}>
          Kopieer prompt
        </Button>
      </div>
    </motion.li>
  )
}

export function PromptsPage({ param }: { param?: string }) {
  const { data, editMode, update } = usePortfolio()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [lu, setLu] = useState<LuId | null>(null)
  const [tag, setTag] = useState<string | null>(null)

  useEffect(() => {
    if (param) document.getElementById(`prompt-${param}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [param])

  const categories = useMemo(() => [...new Set(data.prompts.map((p) => p.category).filter(Boolean))].sort(), [data.prompts])

  const filtered = data.prompts.filter((p) => {
    if (category && p.category !== category) return false
    if (lu && !p.learningOutcomes.includes(lu)) return false
    if (tag && !p.tags.includes(tag)) return false
    if (query) {
      const haystack = [p.title, p.category, p.role, p.context, p.task, p.output, ...p.tools, ...p.tags].join(' ').toLowerCase()
      if (!haystack.includes(query.toLowerCase())) return false
    }
    return true
  })

  const hasFilters = Boolean(query || category || lu || tag)

  const addPrompt = () => {
    const id = uid('prompt')
    update((d) =>
      void d.prompts.unshift({
        id,
        title: 'Nieuwe prompt',
        category: category ?? 'Algemeen',
        learningOutcomes: [],
        role: '',
        context: '',
        task: '',
        output: '',
        tools: [],
        tags: [],
      }),
    )
    toast('Nieuwe prompt toegevoegd')
  }

  return (
    <>
      <PageHeader
        icon={Library}
        kicker="Prompt Library"
        title="Mijn promptbibliotheek"
        path="prompts"
        description="Beproefde prompts voor sport, marketing en data. Elke prompt volgt dezelfde opbouw (rol, context, taak en output) en is gekoppeld aan de leeruitkomsten."
        actions={editMode && <Button variant="primary" icon={Plus} onClick={addPrompt}>Prompt toevoegen</Button>}
      />

      <div className="mb-8 space-y-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek op titel, tool of tag…"
            aria-label="Prompts doorzoeken"
            className="w-full rounded-xl border border-line bg-surface py-3 pr-4 pl-10 text-ink placeholder:text-muted focus:border-lime focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter op categorie">
          <FilterChip active={!category} onClick={() => setCategory(null)}>Alle categorieën</FilterChip>
          {categories.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {c}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter op leeruitkomst">
          {LU_IDS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={lu === id}
              onClick={() => setLu(lu === id ? null : id)}
              title={data.learningOutcomes.find((l) => l.id === id)?.title}
              className={cn(
                'rounded-md border px-2.5 py-1 font-mono text-xs transition-colors',
                lu === id ? 'border-lime bg-lime/15 text-lime' : 'border-line text-muted hover:text-ink',
              )}
            >
              {id}
            </button>
          ))}
          {tag && (
            <button type="button" onClick={() => setTag(null)} className="flex items-center gap-1 rounded-md border border-data/40 bg-data/10 px-2.5 py-1 font-mono text-xs text-data">
              <Tag className="size-3" aria-hidden /> #{tag} <X className="size-3" aria-label="Tagfilter wissen" />
            </button>
          )}
          <p className="ml-auto text-sm text-muted" aria-live="polite">
            {filtered.length} van {data.prompts.length} prompts
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="Geen prompts gevonden">
          {hasFilters ? (
            <Button
              variant="ghost"
              onClick={() => {
                setQuery('')
                setCategory(null)
                setLu(null)
                setTag(null)
              }}
            >
              Filters wissen
            </Button>
          ) : (
            'Zet de bewerkmodus aan om je eerste prompt toe te voegen.'
          )}
        </EmptyState>
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2">
          <AnimatePresence initial={false}>
            {filtered.map((p) => (
              <PromptCard key={p.id} prompt={p} highlighted={param === p.id} onTag={setTag} />
            ))}
          </AnimatePresence>
        </ul>
      )}

    </>
  )
}
