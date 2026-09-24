import { BookOpen, ExternalLink, FlaskConical, Lightbulb, ListChecks, Microscope, Plus, Trash2 } from 'lucide-react'
import { EditableList, EditableText } from '../components/editable'
import { PageHeader, SectionTitle } from '../components/PageHeader'
import { Button, Card, IconButton, Reveal } from '../components/ui'
import { usePortfolio } from '../hooks/usePortfolio'
import { isSafeUrl, uid } from '../lib/utils'
import type { Research, Source } from '../types'

export function ResearchPage() {
  const { data, editMode, update } = usePortfolio()
  const r = data.research
  const set = <K extends keyof Research>(key: K) => (value: Research[K]) => update((d) => void (d.research[key] = value))
  const patchSource = (id: string, changes: Partial<Source>) =>
    update((d) => {
      const s = d.research.sources.find((x) => x.id === id)
      if (s) Object.assign(s, changes)
    })

  return (
    <>
      <PageHeader
        icon={Microscope}
        kicker="Onderzoek Sportmarketing"
        title={r.title || 'Onderzoek'}
        path="onderzoek"
        description="Van onderzoeksvraag naar bruikbaar inzicht: hoe AI sportclubs helpt hun fans te bereiken."
      />

      {editMode && (
        <div className="mb-6 max-w-xl">
          <EditableText value={r.title} onChange={set('title')} label="Titel van het onderzoek" />
        </div>
      )}

      {/* Onderzoeksvraag */}
      <Reveal>
        <section aria-labelledby="vraag" className="relative mb-8 overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-br from-lime/[0.08] to-transparent p-6 sm:p-10">
          <p id="vraag" className="kicker mb-4">Hoofdvraag</p>
          <EditableText
            value={r.question}
            onChange={set('question')}
            label="Onderzoeksvraag"
            multiline
            className="max-w-4xl font-display text-3xl leading-tight font-bold sm:text-4xl"
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="label">Deelvragen</p>
              <EditableList items={r.subQuestions} onChange={set('subQuestions')} label="Deelvraag" variant="numbered" addLabel="Deelvraag toevoegen" />
            </div>
            <div>
              <p className="label flex items-center gap-1.5">
                <FlaskConical className="size-3.5" aria-hidden /> Methode
              </p>
              <EditableText value={r.method} onChange={set('method')} label="Methode" multiline className="text-ink/90" />
            </div>
          </div>
        </section>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card className="h-full">
            <SectionTitle icon={ListChecks}>Resultaten</SectionTitle>
            <EditableList items={r.results} onChange={set('results')} label="Resultaat" emptyText="Nog geen resultaten." addLabel="Resultaat toevoegen" />
          </Card>
        </Reveal>
        <Reveal delay={0.05}>
          <Card className="h-full border-data/30">
            <SectionTitle icon={Lightbulb}>Inzichten</SectionTitle>
            {editMode ? (
              <EditableList items={r.insights} onChange={set('insights')} label="Inzicht" addLabel="Inzicht toevoegen" />
            ) : (
              <ul className="space-y-3">
                {r.insights.filter(Boolean).map((insight, i) => (
                  <li key={i} className="rounded-xl border border-data/20 bg-data/[0.06] p-4 text-ink/90">
                    {insight}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Reveal>
      </div>

      {/* Bronnen */}
      <Reveal className="mt-6">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle icon={BookOpen}>Bronnen</SectionTitle>
            {editMode && (
              <Button
                size="sm"
                icon={Plus}
                onClick={() =>
                  update((d) => void d.research.sources.push({ id: uid('src'), title: '', author: '', year: '', url: 'https://' }))
                }
              >
                Bron toevoegen
              </Button>
            )}
          </div>
          {r.sources.length === 0 ? (
            <p className="text-sm text-muted italic">Nog geen bronnen toegevoegd.</p>
          ) : editMode ? (
            <div className="space-y-3">
              {r.sources.map((s, i) => (
                <div key={s.id} className="grid gap-2 rounded-xl border border-line/70 p-3 md:grid-cols-[2fr_1.2fr_0.6fr_2fr_auto]">
                  <input className="field" value={s.title} placeholder="Titel" aria-label={`Bron ${i + 1}: titel`} onChange={(e) => patchSource(s.id, { title: e.target.value })} />
                  <input className="field" value={s.author} placeholder="Auteur" aria-label={`Bron ${i + 1}: auteur`} onChange={(e) => patchSource(s.id, { author: e.target.value })} />
                  <input className="field" value={s.year} placeholder="Jaar" aria-label={`Bron ${i + 1}: jaar`} onChange={(e) => patchSource(s.id, { year: e.target.value })} />
                  <input className="field font-mono text-sm" type="url" value={s.url} placeholder="https://…" aria-label={`Bron ${i + 1}: URL`} onChange={(e) => patchSource(s.id, { url: e.target.value })} />
                  <IconButton icon={Trash2} tone="danger" label={`Bron ${i + 1} verwijderen`} onClick={() => update((d) => void (d.research.sources = d.research.sources.filter((x) => x.id !== s.id)))} />
                </div>
              ))}
            </div>
          ) : (
            <ol className="divide-y divide-line">
              {r.sources.map((s, i) => (
                <li key={s.id} className="flex items-start gap-4 py-3">
                  <span className="font-mono text-sm text-muted">[{i + 1}]</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-ink">
                      {s.author && <span>{s.author} </span>}
                      {s.year && <span className="text-muted">({s.year}). </span>}
                      <cite className="not-italic">{s.title}</cite>
                    </p>
                  </div>
                  {isSafeUrl(s.url) && s.url !== 'https://' && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-data hover:text-lime" aria-label={`Bron openen: ${s.title} (nieuw tabblad)`}>
                      Openen <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          )}
        </Card>
      </Reveal>
    </>
  )
}
