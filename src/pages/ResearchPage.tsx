import {
  BookOpen,
  CircleCheck,
  CircleX,
  ClipboardList,
  ExternalLink,
  FlaskConical,
  Gavel,
  Info,
  Layers,
  Lightbulb,
  ListChecks,
  MessageSquareText,
  Microscope,
  Plus,
  Scale,
  Target,
  Trash2,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { EditableList, EditableText } from '../components/editable'
import { Expandable } from '../components/Expandable'
import { ResearchVisual } from '../components/ResearchVisual'
import { PageHeader, SectionTitle } from '../components/PageHeader'
import { Badge, Button, Card, IconButton, PriorityBadge, Reveal } from '../components/ui'
import { href } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { cn, isSafeUrl, splitTitled, uid } from '../lib/utils'
import type { AssessmentRow, Research, RiskLevelRow, Source, Stakeholder, Verdict } from '../types'

const verdictView: Record<Verdict, { label: string; tone: 'lime' | 'flame' | 'danger' | 'data'; icon: LucideIcon }> = {
  ok: { label: 'Voldoet', tone: 'lime', icon: CircleCheck },
  warn: { label: 'Aandachtspunt', tone: 'flame', icon: TriangleAlert },
  fail: { label: 'Voldoet niet', tone: 'danger', icon: CircleX },
  info: { label: 'Vastgesteld', tone: 'data', icon: Info },
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const v = verdictView[verdict]
  return (
    <Badge tone={v.tone} className="shrink-0">
      <v.icon className="size-3" aria-hidden /> {v.label}
    </Badge>
  )
}

/** Keuzelijst voor een oordeel in de bewerkmodus, met leesbare labels. */
function VerdictSelect({ value, onChange, label }: { value: Verdict; onChange: (v: Verdict) => void; label: string }) {
  return (
    <select aria-label={label} className="field w-auto py-1 text-xs" value={value} onChange={(e) => onChange(e.target.value as Verdict)}>
      {(Object.keys(verdictView) as Verdict[]).map((v) => (
        <option key={v} value={v}>
          {verdictView[v].label}
        </option>
      ))}
    </select>
  )
}

/** Telt de oordelen, bijv. "6 voldoet · 2 aandachtspunt". */
function VerdictSummary({ verdicts }: { verdicts: Verdict[] }) {
  const order: Verdict[] = ['ok', 'warn', 'fail']
  return (
    <p className="flex flex-wrap gap-1.5" aria-label="Samenvatting van de oordelen">
      {order.map((v) => {
        const count = verdicts.filter((x) => x === v).length
        if (count === 0) return null
        const view = verdictView[v]
        return (
          <Badge key={v} tone={view.tone}>
            <view.icon className="size-3" aria-hidden /> {count} × {view.label.toLowerCase()}
          </Badge>
        )
      })}
    </p>
  )
}

const thClass = 'border-b border-line px-3 py-2 font-mono text-[11px] font-medium tracking-wider text-muted uppercase'
const tdClass = 'border-b border-line/60 px-3 py-3 text-ink/90'

function AssessmentTable({ rows }: { rows: AssessmentRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Toetsing van AI-toepassingen aan de AI-verordening, de AVG en ethiek</caption>
        <thead>
          <tr className="text-left">
            {['Toepassing', 'AI-verordening', 'Belangrijkste AVG-punt', 'Grootste ethische risico'].map((h) => (
              <th key={h} scope="col" className={thClass}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.application} className="align-top">
              <th scope="row" className="border-b border-line/60 px-3 py-3 text-left font-medium text-ink">
                {row.application}
              </th>
              <td className={tdClass}>{row.aiAct}</td>
              <td className={tdClass}>{row.avg}</td>
              <td className={tdClass}>{row.ethics}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StakeholderTable({ rows }: { rows: Stakeholder[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Belanghebbenden met hun belang en hun zorg</caption>
        <thead>
          <tr className="text-left">
            {['Wie', 'Belang', 'Zorg'].map((h) => (
              <th key={h} scope="col" className={thClass}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.name} className="align-top">
              <th scope="row" className="border-b border-line/60 px-3 py-3 text-left font-medium text-ink">
                {s.name}
              </th>
              <td className={tdClass}>{s.interest}</td>
              <td className={tdClass}>{s.concern}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Kop die een groot deel van het onderzoek aankondigt. */
function PartHeading({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <div className="mt-12 mb-6 border-t border-line pt-8">
      <p className="kicker mb-2">{label}</p>
      <h2 className="text-3xl font-bold uppercase sm:text-4xl">{title}</h2>
      {children && <div className="mt-3 max-w-3xl text-muted">{children}</div>}
    </div>
  )
}

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
      <figcaption className="mt-3 text-xs text-muted">Risiconiveaus van de Europese AI-verordening, met per niveau een voorbeeld uit de sport.</figcaption>
    </figure>
  )
}

export function ResearchPage({ param }: { param?: string }) {
  const { data, editMode, update } = usePortfolio()
  const all = [data.research, ...(data.extraResearch ?? [])]
  const index = Math.min(Math.max(Number(param) || 1, 1), all.length) - 1
  const r = all[index]
  const hasCase = Boolean(r.caseStudy)
  const [view, setView] = useState<'visual' | 'full'>('visual')
  const showVisual = Boolean(r.visual) && view === 'visual' && !editMode

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

      {r.visual && !editMode && (
        <div role="tablist" aria-label="Weergave" className="mb-6 inline-flex rounded-xl border border-line bg-surface p-1">
          {([
            ['visual', 'Visueel'],
            ['full', 'Volledig verslag'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={cn(
                'rounded-lg px-4 py-1.5 text-sm transition-colors',
                view === id ? 'bg-lime font-semibold text-lime-dark' : 'text-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {showVisual ? (
        <Reveal>
          <ResearchVisual research={r} />
          <p className="mt-3 text-center text-sm text-muted">
            Alle onderbouwing, bronnen en details staan in het{' '}
            <button type="button" onClick={() => setView('full')} className="font-medium text-lime underline-offset-4 hover:underline">
              volledige verslag
            </button>
            .
          </p>
        </Reveal>
      ) : (
      <>
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
            {hasCase ? (
              <div className="self-start">
                <Expandable
                  title="Hoe heb ik dit onderzocht?"
                  teaser="Literatuuronderzoek en één casus"
                  forceOpen={editMode}
                  aside={<FlaskConical className="size-4 text-muted" aria-hidden />}
                >
                  <EditableText value={r.method} onChange={set('method')} label="Methode" multiline className="text-sm leading-relaxed text-ink/90" />
                </Expandable>
              </div>
            ) : (
              <div>
                <p className="label flex items-center gap-1.5">
                  <FlaskConical className="size-3.5" aria-hidden /> Methode
                </p>
                <EditableText value={r.method} onChange={set('method')} label="Methode" multiline className="text-ink/90" />
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {r.tldr && r.tldr.length > 0 && (
        <Reveal className="mb-6">
          <section aria-labelledby="kort" className="rounded-2xl border border-line bg-surface/80 p-5 sm:p-6">
            <p id="kort" className="kicker mb-4">In het kort</p>
            {editMode ? (
              <EditableList items={r.tldr} onChange={set('tldr')} label="Kernpunt" addLabel="Kernpunt toevoegen" />
            ) : (
              <ol className="grid gap-3 sm:grid-cols-2">
                {r.tldr.map((point, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-line/70 bg-bg/40 p-4">
                    <span className="font-display text-2xl leading-none font-extrabold text-lime">{i + 1}</span>
                    <span className="text-sm text-ink/90">{point}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </Reveal>
      )}

      {r.note && (
        <Reveal className="mb-6">
          <aside className="flex gap-3 rounded-xl border border-data/40 bg-data/[0.06] px-4 py-3 text-sm" aria-label="Actualiteit">
            <Info className="mt-0.5 size-4 shrink-0 text-data" aria-hidden />
            <div className="min-w-0 flex-1">
              <EditableText value={r.note} onChange={set('note')} label="Actualiteit" multiline rows={2} className="text-ink/90" />
            </div>
          </aside>
        </Reveal>
      )}

      {hasCase && <PartHeading label="Deel 1" title="Vijf werkvelden van de sport" />}

      {r.image?.src && (
        <Reveal className="mb-6">
          <figure className="overflow-hidden rounded-2xl border border-line bg-surface/80 p-3 sm:p-4">
            <a href={r.image.src} target="_blank" rel="noopener noreferrer" aria-label="Afbeelding groot openen (nieuw tabblad)">
              <img src={r.image.src} alt={r.image.alt} loading="lazy" className="w-full rounded-xl" />
            </a>
            {r.image.caption && <figcaption className="mt-3 px-1 text-xs text-muted">{r.image.caption}</figcaption>}
          </figure>
        </Reveal>
      )}

      {hasCase ? (
        <>
          <Reveal className="mb-3">
            <ul className="grid gap-3 md:grid-cols-2" aria-label="Resultaten per werkveld">
              {r.results.map((text, i) => {
                const { title, teaser, rest } = splitTitled(text)
                return (
                  <li key={i}>
                    <Expandable title={title || `Werkveld ${i + 1}`} teaser={teaser} forceOpen={editMode}>
                      {editMode ? (
                        <EditableText value={text} onChange={(v) => mutate((t) => void (t.results[i] = v))} label={`Resultaat ${i + 1}`} multiline rows={6} />
                      ) : (
                        <p className="text-sm leading-relaxed text-ink/90">{rest || teaser}</p>
                      )}
                    </Expandable>
                  </li>
                )
              })}
            </ul>
          </Reveal>
          <Reveal className="mb-6 grid gap-3 md:grid-cols-2">
            {r.riskLevels && r.riskLevels.length > 0 && (
              <Expandable title="Uitleg: de vier risiconiveaus" teaser="Wat betekent minimaal, beperkt, hoog en verboden?" aside={<Layers className="size-4 text-muted" aria-hidden />}>
                <RiskFigure rows={r.riskLevels} />
              </Expandable>
            )}
            {r.assessment && r.assessment.length > 0 && (
              <Expandable title="Toetsingstabel per werkveld" teaser="AI-verordening, AVG en ethiek naast elkaar" aside={<Scale className="size-4 text-muted" aria-hidden />}>
                <AssessmentTable rows={r.assessment} />
              </Expandable>
            )}
          </Reveal>
        </>
      ) : (
        <>
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
                <AssessmentTable rows={r.assessment} />
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
        </>
      )}

      {r.caseStudy && (
        <>
          <PartHeading label="Deel 2" title={r.caseStudy.title}>
            <EditableText value={r.caseStudy.intro} onChange={(v) => mutate((t) => void (t.caseStudy!.intro = v))} label="Inleiding casus" multiline />
          </PartHeading>

          <Reveal className="mb-6">
            <Card>
              <SectionTitle icon={ClipboardList}>De feiten</SectionTitle>
              <EditableList items={r.caseStudy.facts} onChange={(facts) => mutate((t) => void (t.caseStudy!.facts = facts))} label="Feit" addLabel="Feit toevoegen" />
            </Card>
          </Reveal>

          <Reveal className="mb-6">
            <Card>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <SectionTitle icon={Gavel}>Getoetst in negen stappen</SectionTitle>
                <VerdictSummary verdicts={r.caseStudy.steps.map((s) => s.verdict)} />
              </div>
              <ol className="space-y-2">
                {r.caseStudy.steps.map((step, i) => (
                  <li key={step.question}>
                    <Expandable
                      title={step.question}
                      teaser={step.short}
                      forceOpen={editMode}
                      aside={
                        editMode ? (
                          <VerdictSelect value={step.verdict} label={`Oordeel stap ${i + 1}`} onChange={(verdict) => mutate((t) => void (t.caseStudy!.steps[i].verdict = verdict))} />
                        ) : (
                          <VerdictBadge verdict={step.verdict} />
                        )
                      }
                    >
                      <EditableText
                        value={step.finding}
                        onChange={(v) => mutate((t) => void (t.caseStudy!.steps[i].finding = v))}
                        label={`Uitleg stap ${i + 1}`}
                        multiline
                        rows={3}
                        className="text-sm leading-relaxed text-ink/90"
                      />
                    </Expandable>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full border-lime/40">
                <SectionTitle icon={Target}>Mijn oordeel</SectionTitle>
                <EditableText value={r.caseStudy.conclusion} onChange={(v) => mutate((t) => void (t.caseStudy!.conclusion = v))} label="Oordeel casus" multiline rows={4} className="text-ink/90" />
              </Card>
            </Reveal>
            <Reveal delay={0.05}>
              <Card className="h-full">
                <SectionTitle icon={Scale}>En in Nederland?</SectionTitle>
                <EditableText value={r.caseStudy.comparison} onChange={(v) => mutate((t) => void (t.caseStudy!.comparison = v))} label="Vergelijking Nederland" multiline rows={4} className="text-ink/90" />
              </Card>
            </Reveal>
          </div>
        </>
      )}

      {r.ethics && r.ethics.length > 0 && (
        <Reveal className="mb-6">
          <Card>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
              <SectionTitle icon={Scale}>Ethische afweging</SectionTitle>
              <VerdictSummary verdicts={r.ethics.map((e) => e.verdict)} />
            </div>
            {r.ethicsFramework && <p className="-mt-2 mb-4 text-sm text-muted">{r.ethicsFramework}</p>}
            <ul className="grid gap-2 md:grid-cols-2">
              {r.ethics.map((row, i) => {
                const { teaser, rest } = splitTitled(row.assessment)
                return (
                  <li key={row.requirement}>
                    <Expandable
                      title={row.requirement}
                      teaser={editMode ? undefined : teaser}
                      forceOpen={editMode}
                      aside={
                        editMode ? (
                          <VerdictSelect value={row.verdict} label={`Oordeel ${row.requirement}`} onChange={(verdict) => mutate((t) => void (t.ethics![i].verdict = verdict))} />
                        ) : (
                          <VerdictBadge verdict={row.verdict} />
                        )
                      }
                    >
                      {editMode ? (
                        <EditableText value={row.assessment} onChange={(v) => mutate((t) => void (t.ethics![i].assessment = v))} label={`Beoordeling ${row.requirement}`} multiline rows={3} />
                      ) : (
                        <p className="text-sm leading-relaxed text-ink/90">{rest || 'Zie hierboven.'}</p>
                      )}
                    </Expandable>
                  </li>
                )
              })}
            </ul>
            {r.stakeholders && r.stakeholders.length > 0 && (
              <div className="mt-3">
                <Expandable
                  title="Wie heeft er belang bij?"
                  teaser="Veiligheid van iedereen tegenover privacy van iedereen"
                  aside={<Users className="size-4 text-muted" aria-hidden />}
                >
                  <StakeholderTable rows={r.stakeholders} />
                </Expandable>
              </div>
            )}
          </Card>
        </Reveal>
      )}

      {hasCase && <PartHeading label="Deel 3" title="Aanbevelingen en conclusie" />}

      {r.recommendations && r.recommendations.length > 0 && (
        <Reveal className="mb-6">
          <Card>
            <SectionTitle icon={MessageSquareText}>Wat moet er gebeuren?</SectionTitle>
            <ol className="space-y-2">
              {r.recommendations.map((rec, i) => (
                <li key={i} className="flex flex-col gap-2 rounded-xl border border-line bg-bg/40 p-3 sm:flex-row sm:items-start sm:gap-3">
                  <div className="flex shrink-0 gap-1.5 sm:w-48 sm:flex-col sm:items-start">
                    <Badge tone="data">{rec.actor}</Badge>
                    <PriorityBadge priority={rec.priority} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <EditableText
                      value={rec.action}
                      onChange={(v) => mutate((t) => void (t.recommendations![i].action = v))}
                      label={`Aanbeveling ${i + 1}`}
                      multiline
                      rows={2}
                      className="text-sm font-medium text-ink"
                    />
                    <p className="mt-0.5 text-xs text-muted">{rec.basis}</p>
                  </div>
                </li>
              ))}
            </ol>
            {hasCase && r.insights.length > 0 && (
              <div className="mt-3">
                <Expandable title={r.insightsLabel || 'Algemene aanbevelingen'} teaser="Zes vuistregels voor elke AI-toepassing in de sport" forceOpen={editMode} aside={<Lightbulb className="size-4 text-muted" aria-hidden />}>
                  {editMode ? (
                    <EditableList items={r.insights} onChange={set('insights')} label="Aanbeveling" addLabel="Toevoegen" />
                  ) : (
                    <ul className="space-y-2">
                      {r.insights.filter(Boolean).map((insight, i) => (
                        <li key={i} className="flex gap-2 text-sm text-ink/90">
                          <span aria-hidden className="mt-2 h-0.5 w-3 shrink-0 bg-lime" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Expandable>
              </div>
            )}
          </Card>
        </Reveal>
      )}

      {r.conclusion && (
        <Reveal className="mb-6">
          <section aria-labelledby="conclusie" className="rounded-3xl border border-lime/30 bg-gradient-to-br from-lime/[0.08] to-transparent p-6 sm:p-8">
            <p id="conclusie" className="kicker mb-3">Conclusie</p>
            <EditableText value={r.conclusion} onChange={set('conclusion')} label="Conclusie" multiline rows={5} className="max-w-4xl text-lg leading-relaxed text-ink" />
          </section>
        </Reveal>
      )}

      {hasCase && (r.limitations?.length || editMode || r.ownPosition?.trim()) && (
        <Reveal className="mb-6 grid gap-3 md:grid-cols-2">
          {(editMode || r.ownPosition?.trim()) && (
            <Expandable title="Mijn standpunt" teaser={editMode ? undefined : 'Wat ik er zelf van vind'} defaultOpen forceOpen={editMode} aside={<Target className="size-4 text-lime" aria-hidden />}>
              <EditableText
                value={r.ownPosition ?? ''}
                onChange={set('ownPosition')}
                label="Mijn standpunt"
                placeholder="Zou jij als sportprofessional gezichtsherkenning (of een andere AI-toepassing) invoeren? Waarom wel of niet? Welke risico’s vind jij het zwaarst wegen?"
                multiline
                rows={6}
                className="text-sm leading-relaxed text-ink/90"
              />
            </Expandable>
          )}
          {r.limitations && r.limitations.length > 0 && (
            <Expandable title="Beperkingen van mijn onderzoek" teaser={`${r.limitations.length} kanttekeningen`} forceOpen={editMode} aside={<Info className="size-4 text-muted" aria-hidden />}>
              <EditableList items={r.limitations} onChange={set('limitations')} label="Beperking" addLabel="Beperking toevoegen" />
            </Expandable>
          )}
        </Reveal>
      )}

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
          ) : hasCase ? (
            <Expandable title={`Alle ${r.sources.length} bronnen bekijken`} teaser="Wetten, wetenschappelijke artikelen en praktijkvoorbeelden">
              <SourceList sources={r.sources} />
            </Expandable>
          ) : (
            <SourceList sources={r.sources} />
          )}
        </Card>
      </Reveal>
      </>
      )}
    </>
  )
}

function SourceList({ sources }: { sources: Source[] }) {
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
