import { motion } from 'motion/react'
import { ChartColumn, CircleCheck, ClipboardCheck, Flag, GraduationCap, Grid3x3, LayoutDashboard, Route } from 'lucide-react'
import { useState } from 'react'
import { EditableText } from '../components/editable'
import { PageHeader, SectionTitle } from '../components/PageHeader'
import { Badge, Card, ProgressBar, Reveal } from '../components/ui'
import { href } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { average, isAchieved, luAchievedIn, luCount, luPct, minorProgress, sprintLuAchieved, sprintLuAverage, storyProgress } from '../lib/utils'
import { LU_IDS } from '../types'

function StatTile({ icon: Icon, label, value, sub }: { icon: typeof Flag; label: string; value: string; sub: string }) {
  return (
    <Card className="p-5">
      <p className="label flex items-center gap-1.5">
        <Icon className="size-3.5 text-lime" aria-hidden /> {label}
      </p>
      <p className="font-mono text-4xl font-bold text-ink tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </Card>
  )
}

/** Gegroepeerde staafgrafiek: per sprint user stories en leeruitkomsten naast elkaar. */
function SprintChart() {
  const { data } = usePortfolio()
  const [hover, setHover] = useState<number | null>(null)
  const series = [
    { key: 'stories', label: 'User stories afgerond', color: 'var(--color-chart-2)', get: storyProgress },
    { key: 'lu', label: 'Leeruitkomsten behaald', color: 'var(--color-chart-1)', get: sprintLuAverage },
  ] as const

  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs text-muted" aria-label="Legenda">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: s.color }} aria-hidden />
            {s.label}
          </li>
        ))}
      </ul>
      <div className="relative">
        {/* Recessieve rasterlijnen */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48">
          {[100, 50, 0].map((v) => (
            <div key={v} className="absolute inset-x-0 flex items-center gap-2" style={{ top: `${100 - v}%` }}>
              <span className="w-7 -translate-y-1/2 text-right font-mono text-[10px] text-muted">{v}%</span>
              <span className="h-px flex-1 -translate-y-1/2 bg-ink/[0.06]" />
            </div>
          ))}
        </div>
        <div className="ml-9 grid grid-cols-8 gap-1 sm:gap-3">
          {data.sprints.map((sprint, i) => (
            <a
              key={sprint.id}
              href={href('sprints', sprint.number)}
              className="group relative flex flex-col items-center"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`Sprint ${sprint.number}: user stories ${storyProgress(sprint)}%, leeruitkomsten ${sprintLuAverage(sprint)}%`}
            >
              <div className="flex h-48 w-full items-end justify-center gap-0.5 rounded-md group-hover:bg-ink/[0.03]">
                {series.map((s) => (
                  <motion.span
                    key={s.key}
                    className="w-full max-w-4 rounded-t"
                    style={{ background: s.color }}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${Math.max(s.get(sprint), 1)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.04 }}
                  />
                ))}
              </div>
              <span className="mt-2 font-mono text-[11px] text-muted group-hover:text-ink">S{sprint.number}</span>
              {hover === i && (
                <div role="tooltip" className="absolute bottom-full z-20 mb-2 w-44 rounded-lg border border-line bg-surface-2 p-3 text-left text-xs shadow-xl shadow-black/40">
                  <p className="mb-1.5 font-semibold text-ink">
                    Sprint {sprint.number} · {sprint.title}
                  </p>
                  {series.map((s) => (
                    <p key={s.key} className="flex items-center justify-between gap-2 text-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-sm" style={{ background: s.color }} aria-hidden />
                        {s.label}
                      </span>
                      <span className="font-mono text-ink">{s.get(sprint)}%</span>
                    </p>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { data, update, editMode } = usePortfolio()
  const { sprints } = data
  const allStories = sprints.flatMap((s) => s.userStories)
  const doneStories = allStories.filter((u) => u.done).length
  const achievedIn = LU_IDS.map((id) => luAchievedIn(sprints, id))
  const minor = minorProgress(sprints, data.learningOutcomes)

  return (
    <>
      <PageHeader
        icon={LayoutDashboard}
        kicker="Dashboard"
        title="Voortgang in één oogopslag"
        path="dashboard"
        description="Per leeruitkomst heb ik in de minor een minimum aantal voldoendes nodig. Het percentage laat zien hoe ver ik daarmee ben. Per sprint vink ik in de bewerkmodus aan welke leeruitkomsten zijn behaald."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={GraduationCap} label="Minor-voortgang" value={`${minor.pct}%`} sub={`${minor.done} van ${minor.required} voldoendes`} />
        <StatTile icon={Flag} label="Sprints" value={`${sprints.filter((s) => s.status === 'Afgerond').length}/${sprints.length}`} sub={`${sprints.filter((s) => s.status === 'Bezig').length} sprint(s) bezig`} />
        <StatTile icon={ClipboardCheck} label="User stories" value={`${doneStories}/${allStories.length}`} sub="Afgerond over alle sprints" />
        <StatTile icon={Route} label="Roadmap" value={`${average(data.roadmap.map((r) => r.progress))}%`} sub="Gemiddelde voortgang doelen" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <Card className="h-full">
            <SectionTitle icon={GraduationCap}>Per leeruitkomst</SectionTitle>
            <ul className="space-y-5">
              {data.learningOutcomes.map((lo, i) => {
                const required = lo.required ?? 0
                const count = luCount(sprints, lo.id)
                const pct = luPct(count, required)
                return (
                  <li key={lo.id}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <p className="flex min-w-0 items-baseline gap-2">
                        <span className="font-mono text-sm text-lime">{lo.id}</span>
                        {!editMode && <span className="truncate font-medium text-ink">{lo.title}</span>}
                      </p>
                      {pct >= 100 ? (
                        <Badge tone="lime">
                          <CircleCheck className="size-3" aria-hidden /> Voldaan
                        </Badge>
                      ) : (
                        <span className="font-mono text-sm text-ink">{pct}%</span>
                      )}
                    </div>
                    {editMode ? (
                      <div className="mb-2 space-y-2">
                        <EditableText value={lo.title} label={`${lo.id} titel`} onChange={(v) => update((d) => void (d.learningOutcomes[i].title = v))} />
                        <EditableText value={lo.description} label={`${lo.id} omschrijving`} multiline rows={2} onChange={(v) => update((d) => void (d.learningOutcomes[i].description = v))} />
                        <label className="flex items-center gap-2 text-xs text-muted">
                          Minimaal aantal voldoendes
                          <input
                            type="number"
                            min={1}
                            max={8}
                            value={required}
                            onChange={(e) => update((d) => void (d.learningOutcomes[i].required = Math.max(1, Number(e.target.value) || 1)))}
                            className="field w-16 px-2 py-1 text-right font-mono text-sm"
                          />
                        </label>
                      </div>
                    ) : (
                      <p className="mb-2 text-xs text-muted">{lo.description}</p>
                    )}
                    <ProgressBar value={pct} label={`${lo.id}: ${count} van ${required} voldoendes`} />
                    <p className="mt-1.5 text-xs text-muted">
                      <span className="font-mono text-ink">
                        {count} van {required}
                      </span>{' '}
                      voldoendes
                      {achievedIn[i].length > 0 && (
                        <>
                          {' · '}behaald in{' '}
                          {achievedIn[i].map((n, j) => (
                            <span key={n}>
                              {j > 0 && (j === achievedIn[i].length - 1 ? ' en ' : ', ')}
                              <a href={href('sprints', n)} className="font-medium text-lime hover:underline">
                                sprint {n}
                              </a>
                            </span>
                          ))}
                        </>
                      )}
                    </p>
                  </li>
                )
              })}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={0.05}>
          <Card className="h-full">
            <SectionTitle icon={ChartColumn}>Per sprint</SectionTitle>
            <SprintChart />
          </Card>
        </Reveal>
      </div>

      <Reveal className="mt-6">
        <Card>
          <SectionTitle icon={Grid3x3}>Matrix: sprint × leeruitkomst</SectionTitle>
          <p className="-mt-2 mb-4 text-sm text-muted">Een ✓ betekent: in deze sprint behaald (V). Onderaan staat hoeveel voldoendes ik per leeruitkomst heb, tegenover het minimum. Klik op een sprint om die te openen.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-separate border-spacing-0.5 text-sm">
              <caption className="sr-only">Behaalde leeruitkomsten per sprint</caption>
              <thead>
                <tr>
                  <th scope="col" className="p-2 text-left font-mono text-[11px] font-medium tracking-wider text-muted uppercase">
                    Sprint
                  </th>
                  {data.learningOutcomes.map((lo) => (
                    <th key={lo.id} scope="col" title={lo.title} className="p-2 text-center font-mono text-xs font-medium text-muted">
                      {lo.id}
                    </th>
                  ))}
                  <th scope="col" className="p-2 text-center font-mono text-xs font-medium text-muted">
                    Behaald
                  </th>
                </tr>
              </thead>
              <tbody>
                {sprints.map((s) => (
                  <tr key={s.id}>
                    <th scope="row" className="p-2 text-left font-normal">
                      <a href={href('sprints', s.number)} className="text-ink hover:text-lime">
                        <span className="font-mono text-muted">{String(s.number).padStart(2, '0')}</span> {s.title}
                      </a>
                    </th>
                    {LU_IDS.map((id) => {
                      const score = s.learningOutcomes[id]?.score ?? 0
                      return (
                        <td
                          key={id}
                          title={`Sprint ${s.number}, ${id}: ${isAchieved(score) ? 'behaald' : 'niet behaald'}`}
                          className="rounded-md p-2 text-center font-mono text-xs text-ink tabular-nums"
                          style={{ background: isAchieved(score) ? 'color-mix(in srgb, var(--color-chart-1) 55%, transparent)' : 'color-mix(in srgb, var(--color-ink) 4%, transparent)' }}
                        >
                          {isAchieved(score) ? <span aria-label="behaald">✓</span> : <span aria-label="niet behaald">–</span>}
                        </td>
                      )
                    })}
                    <td className="p-2 text-center font-mono text-xs text-muted">
                      {sprintLuAchieved(s)}/{LU_IDS.length}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className="p-2 text-left text-xs font-medium text-muted">
                    Voldoendes / minimum
                  </th>
                  {data.learningOutcomes.map((lo) => {
                    const count = luCount(sprints, lo.id)
                    return (
                      <td key={lo.id} className="p-2 text-center font-mono text-xs text-ink">
                        {count}/{lo.required ?? 0}
                      </td>
                    )
                  })}
                  <td className="p-2 text-center font-mono text-xs font-bold text-lime">{minor.pct}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </Reveal>
    </>
  )
}
