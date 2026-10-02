import { motion } from 'motion/react'
import { ArrowRight, CalendarRange, CircleCheck, CircleDashed, LoaderCircle } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar, StatusBadge } from '../components/ui'
import { href } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { cn, sprintLuAchieved, sprintLuAverage, storyProgress } from '../lib/utils'
import { LU_IDS } from '../types'

export function TimelinePage() {
  const { data } = usePortfolio()
  const done = data.sprints.filter((s) => s.status === 'Afgerond').length

  return (
    <>
      <PageHeader
        icon={CalendarRange}
        kicker="Sprinttijdlijn"
        title="Van kick-off tot eindpresentatie"
        path="tijdlijn"
        description={`${done} van de ${data.sprints.length} sprints zijn afgerond. Klik op een sprint voor alle details.`}
      />

      <ol className="relative mx-auto max-w-4xl">
        {/* De "baan": verticale lijn die meegroeit met de voortgang */}
        <div aria-hidden className="absolute top-0 bottom-0 left-5 w-0.5 bg-line md:left-1/2 md:-translate-x-1/2" />
        <motion.div
          aria-hidden
          className="absolute top-0 left-5 w-0.5 origin-top bg-lime md:left-1/2 md:-translate-x-1/2"
          initial={{ height: 0 }}
          animate={{ height: `${(done / Math.max(1, data.sprints.length)) * 100}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {data.sprints.map((s, i) => {
          const left = i % 2 === 0
          const Icon = s.status === 'Afgerond' ? CircleCheck : s.status === 'Bezig' ? LoaderCircle : CircleDashed
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: left ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45 }}
              className="relative mb-8 pl-14 md:grid md:grid-cols-2 md:gap-12 md:pl-0"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute top-4 left-5 z-10 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-bg md:left-1/2',
                  s.status === 'Afgerond' && 'border-lime text-lime',
                  s.status === 'Bezig' && 'border-data text-data shadow-[0_0_0_6px_rgb(92_207_238/0.15)]',
                  s.status === 'Gepland' && 'border-line text-muted',
                )}
              >
                <Icon className="size-5" />
              </span>

              <div className={cn(left ? 'md:col-start-1 md:text-right' : 'md:col-start-2')}>
                <a
                  href={href('sprints', s.number)}
                  className={cn(
                    'group block rounded-2xl border bg-surface/80 p-5 transition-colors hover:border-lime/60',
                    s.status === 'Bezig' ? 'border-data/50' : 'border-line',
                  )}
                >
                  <div className={cn('mb-2 flex flex-wrap items-center gap-2', left && 'md:justify-end')}>
                    <span className="font-mono text-xs text-muted">{s.period}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <h2 className="text-2xl leading-tight font-bold uppercase group-hover:text-lime">
                    <span className="text-muted">Sprint {s.number} · </span>
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{s.goal}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                    <div>
                      <p className="mb-1 text-[11px] text-muted">User stories {storyProgress(s)}%</p>
                      <ProgressBar value={storyProgress(s)} label={`User stories sprint ${s.number}`} tone="data" />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-muted">Leeruitkomsten {sprintLuAchieved(s)}/{LU_IDS.length} behaald</p>
                      <ProgressBar value={sprintLuAverage(s)} label={`Leeruitkomsten sprint ${s.number}`} />
                    </div>
                  </div>
                  <span className={cn('mt-4 flex items-center gap-1 text-sm text-lime opacity-80 group-hover:opacity-100', left && 'md:justify-end')}>
                    Bekijk sprint <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </a>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </>
  )
}
