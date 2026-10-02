import { motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleCheck,
  ClipboardCheck,
  Flag,
  Footprints,
  GraduationCap,
  Link2,
  MessageSquareQuote,
  Plus,
  Presentation,
  ScanSearch,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { EditableSelect, EditableText, LinkList } from '../components/editable'
import { PageHeader, SectionTitle } from '../components/PageHeader'
import { Badge, Card, EmptyState, ProgressBar, Reveal, StatusBadge, Button } from '../components/ui'
import { href } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { cn, isAchieved, LU_ACHIEVED, luCount, luPct, sprintLuAchieved, sprintLuAverage, storyProgress, uid } from '../lib/utils'
import { UserStoryCard } from '../components/UserStoryCard'
import { LU_IDS, type Sprint, type SprintStatus } from '../types'

const STATUSES: SprintStatus[] = ['Gepland', 'Bezig', 'Afgerond']

const pad = (n: number) => String(n).padStart(2, '0')

function SprintOverview() {
  const { data } = usePortfolio()
  return (
    <>
      <PageHeader
        icon={Flag}
        kicker="Sprintportfolio"
        title="Acht sprints"
        path="sprints"
        description="Elke sprint heeft user stories, acceptatiecriteria, feedback, een zelfevaluatie en voortgang op de leeruitkomsten LU1 tot en met LU5. Klik op een sprint voor alle details."
      />
      <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.sprints.map((s, i) => (
          <motion.li key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <a
              href={href('sprints', s.number)}
              className={cn(
                'group flex h-full flex-col rounded-2xl border bg-surface/80 p-5 transition-all hover:-translate-y-1 hover:border-lime/60',
                s.status === 'Bezig' ? 'border-data/50' : 'border-line',
              )}
            >
              <div className="mb-4 flex items-start justify-between">
                <span
                  className={cn(
                    'font-display text-6xl leading-none font-extrabold',
                    s.status === 'Afgerond' ? 'text-lime' : s.status === 'Bezig' ? 'text-data' : 'text-line',
                  )}
                  aria-hidden
                >
                  {pad(s.number)}
                </span>
                <StatusBadge status={s.status} />
              </div>
              <p className="font-mono text-xs text-muted">{s.period}</p>
              <h2 className="mt-1 text-2xl leading-tight font-bold uppercase group-hover:text-lime">
                <span className="sr-only">Sprint {s.number}: </span>
                {s.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{s.goal}</p>
              <div className="mt-auto space-y-2 pt-5">
                <div className="flex justify-between text-xs text-muted">
                  <span>User stories</span>
                  <span className="font-mono">{storyProgress(s)}%</span>
                </div>
                <ProgressBar value={storyProgress(s)} label={`User stories sprint ${s.number}`} tone="data" />
                <div className="flex justify-between text-xs text-muted">
                  <span>Leeruitkomsten behaald</span>
                  <span className="font-mono">{sprintLuAchieved(s)}/{LU_IDS.length}</span>
                </div>
                <ProgressBar value={sprintLuAverage(s)} label={`Leeruitkomsten behaald in sprint ${s.number}`} />
              </div>
            </a>
          </motion.li>
        ))}
      </ol>
    </>
  )
}

function TextBlock({ icon, title, value, onChange, emptyText }: { icon: LucideIcon; title: string; value: string; onChange: (v: string) => void; emptyText: string }) {
  return (
    <Reveal>
      <Card className="h-full">
        <SectionTitle icon={icon}>{title}</SectionTitle>
        <EditableText value={value} onChange={onChange} label={title} multiline rows={4} className="leading-relaxed text-ink/90" emptyText={emptyText} />
      </Card>
    </Reveal>
  )
}

function SprintDetail({ sprint }: { sprint: Sprint }) {
  const { data, editMode, update } = usePortfolio()
  const patch = (fn: (s: Sprint) => void) =>
    update((d) => {
      const s = d.sprints.find((x) => x.id === sprint.id)
      if (s) fn(s)
    })
  const set = <K extends keyof Sprint>(key: K) => (value: Sprint[K]) => patch((s) => void (s[key] = value))

  const idx = data.sprints.findIndex((s) => s.id === sprint.id)
  const prev = data.sprints[idx - 1]
  const next = data.sprints[idx + 1]

  return (
    <>
      <a href={href('sprints')} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-lime">
        <ArrowLeft className="size-4" aria-hidden /> Alle sprints
      </a>
      <PageHeader
        icon={Flag}
        kicker={`Sprint ${pad(sprint.number)} van ${pad(data.sprints.length)}`}
        title={sprint.title || `Sprint ${sprint.number}`}
        path={`sprints/${sprint.number}`}
        actions={
          <a
            href={href('show-grow', sprint.number)}
            className="inline-flex items-center gap-2 rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-lime-dark hover:brightness-110"
          >
            <Presentation className="size-4" aria-hidden /> Presenteer Show & Grow
          </a>
        }
        description={
          <div className="flex flex-wrap items-center gap-3">
            <EditableSelect value={sprint.status} options={STATUSES} onChange={set('status')} label="Status">
              <StatusBadge status={sprint.status} />
            </EditableSelect>
            <span className="flex items-center gap-1.5 text-sm">
              <CalendarDays className="size-4" aria-hidden />
              <EditableText as="span" value={sprint.period} onChange={set('period')} label="Periode" inputClassName="py-1 text-sm" />
            </span>
          </div>
        }
      />

      {editMode && (
        <div className="mb-6 max-w-xl">
          <p className="label">Titel</p>
          <EditableText value={sprint.title} onChange={set('title')} label="Titel van de sprint" />
        </div>
      )}

      <Reveal>
        <div className="mb-6 rounded-2xl border border-lime/30 bg-lime/[0.05] p-5 sm:p-6">
          <p className="kicker mb-2">Sprintdoel</p>
          <EditableText value={sprint.goal} onChange={set('goal')} label="Sprintdoel" multiline rows={2} className="font-display text-2xl leading-snug font-semibold sm:text-3xl" emptyText="Nog geen sprintdoel." />
        </div>
      </Reveal>

      <div className="grid gap-6">
        <Reveal>
          <Card className="h-full">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle icon={ClipboardCheck}>Stories</SectionTitle>
              <span className="mb-4 font-mono text-sm text-muted">
                {sprint.userStories.filter((u) => u.done).length}/{sprint.userStories.length} klaar
              </span>
            </div>
            {sprint.userStories.length === 0 && !editMode && <p className="text-sm text-muted italic">Nog geen stories gepland.</p>}
            <ul className="space-y-3">
              {sprint.userStories.map((story, i) => (
                <UserStoryCard
                  key={story.id}
                  story={story}
                  index={i}
                  onChange={(changes) => patch((s) => Object.assign(s.userStories[i], changes))}
                  onRemove={() => patch((s) => void (s.userStories = s.userStories.filter((u) => u.id !== story.id)))}
                />
              ))}
            </ul>
            {editMode && (
              <Button
                size="sm"
                icon={Plus}
                className="mt-3"
                onClick={() => patch((s) => void s.userStories.push({ id: uid('us'), type: 'US', story: 'Als … wil ik … zodat …', criteria: [''], qualityCriteria: [''], learned: '', evidence: [], done: false }))}
              >
                Story toevoegen
              </Button>
            )}
          </Card>
        </Reveal>

        <Reveal delay={0.05}>
          <Card className="h-full">
            <SectionTitle icon={GraduationCap}>Leeruitkomsten</SectionTitle>
            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {LU_IDS.map((id) => {
                const lo = data.learningOutcomes.find((l) => l.id === id)
                const progress = sprint.learningOutcomes[id] ?? { score: 0, note: '' }
                const required = lo?.required ?? 0
                const countSoFar = luCount(data.sprints, id, sprint.number)
                const pctSoFar = luPct(countSoFar, required)
                return (
                  <li
                    key={id}
                    className={cn(
                      'rounded-xl border p-3',
                      isAchieved(progress.score) ? 'border-lime/40 bg-lime/[0.06]' : 'border-line bg-bg/40',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm">
                        <span className="font-mono text-lime">{id}</span> <span className="text-ink">{lo?.title}</span>
                      </p>
                      {editMode ? (
                        <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
                          <input
                            type="checkbox"
                            checked={isAchieved(progress.score)}
                            onChange={(e) =>
                              patch((s) => void (s.learningOutcomes[id] = { ...progress, score: e.target.checked ? LU_ACHIEVED : 0 }))
                            }
                            className="size-4 accent-lime"
                          />
                          Behaald
                        </label>
                      ) : isAchieved(progress.score) ? (
                        <Badge tone="lime">
                          <CircleCheck className="size-3" aria-hidden /> Behaald
                        </Badge>
                      ) : (
                        <Badge>Niet in deze sprint</Badge>
                      )}
                    </div>
                    {required > 0 && (
                      <div className="mt-2.5">
                        <div className="mb-1 flex justify-between text-[11px] text-muted">
                          <span>
                            Na deze sprint: <span className="font-mono text-ink">{countSoFar} van {required}</span> voldoendes
                          </span>
                          <span className="font-mono text-ink">{pctSoFar}%</span>
                        </div>
                        <ProgressBar value={pctSoFar} label={`${id} na sprint ${sprint.number}: ${countSoFar} van ${required} voldoendes`} />
                      </div>
                    )}
                    <div className="mt-1.5">
                      <EditableText
                        value={progress.note}
                        label={`Toelichting ${id}`}
                        placeholder={`Toelichting bij ${id}`}
                        onChange={(note) => patch((s) => void (s.learningOutcomes[id] = { ...progress, note }))}
                        className="text-xs text-muted"
                        inputClassName="py-1 text-sm"
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <TextBlock icon={MessageSquareQuote} title="Feedback" value={sprint.feedback} onChange={set('feedback')} emptyText="Nog geen feedback." />
        <TextBlock icon={ScanSearch} title="Zelfevaluatie" value={sprint.selfEvaluation} onChange={set('selfEvaluation')} emptyText="Nog geen zelfevaluatie." />
        <TextBlock icon={Sparkles} title="Reflectie" value={sprint.reflection} onChange={set('reflection')} emptyText="Nog geen reflectie." />
        <TextBlock icon={Footprints} title="Volgende stappen" value={sprint.nextSteps} onChange={set('nextSteps')} emptyText="Nog geen volgende stappen." />
      </div>

      <Reveal className="mt-6">
        <Card>
          <SectionTitle icon={Link2}>Bewijslinks</SectionTitle>
          <LinkList links={sprint.evidence} onChange={set('evidence')} label="Bewijslink" />
        </Card>
      </Reveal>

      <nav aria-label="Sprintnavigatie" className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <a href={href('sprints', prev.number)} className="group rounded-2xl border border-line p-4 hover:border-lime/60">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <ArrowLeft className="size-3.5" aria-hidden /> Vorige sprint
            </span>
            <span className="mt-1 block font-display text-xl font-bold uppercase group-hover:text-lime">
              {pad(prev.number)} · {prev.title}
            </span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={href('sprints', next.number)} className="group rounded-2xl border border-line p-4 text-right hover:border-lime/60">
            <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
              Volgende sprint <ArrowRight className="size-3.5" aria-hidden />
            </span>
            <span className="mt-1 block font-display text-xl font-bold uppercase group-hover:text-lime">
              {pad(next.number)} · {next.title}
            </span>
          </a>
        )}
      </nav>
    </>
  )
}

export function SprintsPage({ param }: { param?: string }) {
  const { data } = usePortfolio()
  if (!param) return <SprintOverview />
  const sprint = data.sprints.find((s) => String(s.number) === param)
  if (!sprint) {
    return (
      <EmptyState icon={Flag} title={`Sprint ${param} bestaat niet`}>
        <a href={href('sprints')} className="text-lime underline">
          Terug naar alle sprints
        </a>
      </EmptyState>
    )
  }
  return <SprintDetail key={sprint.id} sprint={sprint} />
}
