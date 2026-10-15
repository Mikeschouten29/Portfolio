import { BookOpen, ExternalLink, FlaskConical, Layers, Lightbulb, ListChecks, Microscope, Plus, Scale, Trash2 } from 'lucide-react'
import { EditableList, EditableText } from '../components/editable'
import { PageHeader, SectionTitle } from '../components/PageHeader'
import { Badge, Button, Card, IconButton, Reveal } from '../components/ui'
import { href } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { cn, isSafeUrl, uid } from '../lib/utils'
import type { Research, RiskLevelRow, Source } from '../types'

const toneClasses: Record<RiskLevelRow['tone'], string> = {
  red: 'border-danger/40 bg-danger/10 text-danger',
  amber: 'border-flame/40 bg-flame/10 text-flame',
  teal: 'border-data/40 bg-data/10 text-data',
  gray: 'border-line bg-surface-2 text-muted',
}

/** Risiconiveaus als figuur: per niveau het artikel en een voorbeeld. */
function RiskFigure({ rows }: { rows: RiskLevelRow[] }) {
  return (
    <figure>
      <ol className="space-y-2" aria-label="Risiconiveaus met voorbeelden">
        {rows.map((row) => (
          <li key={row.level} className="grid gap-2 sm:grid-cols-[minmax(0,15rem)_1fr]">
            <div className={cn('rounded-xl border px-4 py-3', toneClasses[row.tone])}>
              <p className="font-medium">{row.level}</p>
              <p className="text-xs opacity-90">{row.article}</p>
            </div>
            <div className={cn('rounded-xl border px-4 py-3', toneClasses[row.tone])}>
              <p className="font-medium text-ink">{row.example}</p>
              <p className="text-xs text-muted">{row.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-xs text-muted">Risiconiveaus van de Europese AI-verordening, met per niveau een voorbeeld uit de sportmarketing.</figcaption>
    </figure>
  )
}

export function ResearchPage({ param }: { param?: string }) {
  const { data, editMode, update } = usePortfolio()
  const all = [data.research, ...(data.extraResearch ?? [])]
  const index = Math.min(Math.max(Number(param) || 1, 1), all.length) - 1
  const r = all[index]

  /** Past het geselecteerde onderzoek aan (Onderzoek 1 = research, daarna extraResearch). */
  const mutate = (fn: (target: Research) => void) =>
    update((d) => {
      const target = index === 0 ? d.research : d.extraResearch[index - 1]
      if (target) fn(target)
    })
  const set = <K extends keyof Research>(key: K) => (value: Research[K]) => mutate((t) => void (t[key] = value))
  const patchSource = (id: string, changes: Partial<Source>) =>
    mutate((t) => {
      const s = t.sources.find((x) => x.id === id)
      if (s) Object.assign(s, changes)
    })

  return (
    <>
      <PageHeader
        icon={Microscope}
        kicker={`Onderzoek ${index + 1}`}
        title={r.title || 'Onderzoek'}
        path={`onderzoek/${index + 1}`}
        description={
          <div className="space-y-3">
            {r.status && (
              <Badge tone="flame">
                <Layers className="size-3" aria-hidden /> {r.status}
              </Badge>
            )}
            <p>{r.intro || 'Van onderzoeksvraag naar bruikbaar inzicht: hoe AI sportclubs helpt hun fans te bereiken.'}</p>
          </div>
        }
      />

      {all.length > 1 && (
        <nav aria-label="Kies een onderzoek" className="mb-8 flex flex-wrap gap-2">
          {all.map((item, i) => (
            <a
              key={i}
              href={href('onderzoek', i + 1)}
              aria-current={i === index ? 'page' : undefined}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                i === index ? 'border-lime bg-lime text-lime-dark' : 'border-line text-muted hover:border-lime/50 hover:text-ink',
              )}
            >
              <span className="font-mono">{i + 1}</span> · {item.title}
            </a>
          ))}
        </nav>
      )}

      {editMode && (
        <div className="mb-6 grid max-w-3xl gap-3">
          <EditableText value={r.title} onChange={set('title')} label="Titel van het onderzoek" />
          <EditableText value={r.intro ?? ''} onChange={set('intro')} label="Aanleiding" placeholder="Aanleiding (optioneel)" multiline rows={2} />
          <EditableText value={r.status ?? ''} onChange={set('status')} label="Status" placeholder="Status, bijv. Concept (leeg = geen label)" />
        </div>
      )}

      {/* Onderzoeksvraag */}
      <Reveal key={`vraag-${index}`}>
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

      {r.riskLevels && r.riskLevels.length > 0 && (
        <Reveal className="mb-6">
          <Card>
            <SectionTitle icon={Layers}>Risiconiveaus</SectionTitle>
            <RiskFigure rows={r.riskLevels} />
          </Card>
        </Reveal>
      )}

      {r.assessment && r.assessment.length > 0 && (
        <Reveal className="mb-6">
          <Card>
            <SectionTitle icon={Scale}>Toetsing</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
                <caption className="sr-only">Toetsing van AI-toepassingen aan de AI-verordening, de AVG en ethiek</caption>
                <thead>
                  <tr className="text-left">
                    {['Toepassing', 'AI-verordening', 'Belangrijkste AVG-punt', 'Grootste ethische risico'].map((h) => (
                      <th key={h} scope="col" className="border-b border-line px-3 py-2 font-mono text-[11px] font-medium tracking-wider text-muted uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.assessment.map((row) => (
                    <tr key={row.application} className="align-top">
                      <th scope="row" className="border-b border-line/60 px-3 py-3 text-left font-medium text-ink">
                        {row.application}
                      </th>
                      <td className="border-b border-line/60 px-3 py-3 text-ink/90">{row.aiAct}</td>
                      <td className="border-b border-line/60 px-3 py-3 text-ink/90">{row.avg}</td>
                      <td className="border-b border-line/60 px-3 py-3 text-ink/90">{row.ethics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Reveal>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card className="h-full">
            <SectionTitle icon={ListChecks}>Resultaten</SectionTitle>
            <EditableList items={r.results} onChange={set('results')} label="Resultaat" emptyText="Nog geen resultaten." addLabel="Resultaat toevoegen" />
          </Card>
        </Reveal>
        <Reveal delay={0.05}>
          <Card className="h-full border-data/30">
            <SectionTitle icon={Lightbulb}>{r.insightsLabel || 'Inzichten'}</SectionTitle>
            {editMode ? (
              <EditableList items={r.insights} onChange={set('insights')} label={r.insightsLabel || 'Inzicht'} addLabel="Toevoegen" />
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
              <Button size="sm" icon={Plus} onClick={() => mutate((t) => void t.sources.push({ id: uid('src'), title: '', author: '', year: '', url: 'https://' }))}>
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
                  <IconButton icon={Trash2} tone="danger" label={`Bron ${i + 1} verwijderen`} onClick={() => mutate((t) => void (t.sources = t.sources.filter((x) => x.id !== s.id)))} />
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
