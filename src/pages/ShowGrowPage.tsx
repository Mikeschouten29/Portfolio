import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  CircleDashed,
  Footprints,
  Lightbulb,
  Maximize,
  MessageSquareQuote,
  Minimize,
  Pencil,
  Presentation,
  Sparkles,
} from 'lucide-react'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { EditableText, LinkList } from '../components/editable'
import { PageHeader } from '../components/PageHeader'
import { StoryTypeBadge } from '../components/UserStoryCard'
import { Button, IconButton, StatusBadge } from '../components/ui'
import { href } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { cn } from '../lib/utils'
import { STORY_TYPE_LABELS, STORY_TYPES, type Sprint, type UserStory } from '../types'

const pad = (n: number) => String(n).padStart(2, '0')

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
}

function SlideLabel({ icon: Icon, children }: { icon: typeof Lightbulb; children: ReactNode }) {
  return (
    <p className="kicker mb-3 flex items-center gap-2">
      <Icon className="size-4" aria-hidden /> {children}
    </p>
  )
}

function TitleSlide({ sprint, name }: { sprint: Sprint; name: string }) {
  const { update } = usePortfolio()
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="kicker mb-4">Show & Grow · Sprint {pad(sprint.number)}</p>
      <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] font-extrabold uppercase">{sprint.title}</h2>
      <p className="mt-3 font-mono text-sm text-muted">
        {name} · {sprint.period}
      </p>
      {sprint.goal && <p className="mt-6 max-w-3xl text-lg text-ink/90 sm:text-xl">{sprint.goal}</p>}
      <div className="mt-6 max-w-3xl">
        <p className="label">Kernboodschap</p>
        <EditableText
          value={sprint.showGrow}
          onChange={(v) => update((d) => void (d.sprints.find((s) => s.id === sprint.id)!.showGrow = v))}
          label="Kernboodschap"
          placeholder="Wat is de kern van wat je deze sprint hebt geleerd, in één of twee zinnen?"
          multiline
          rows={2}
          className="border-l-2 border-lime pl-4 text-lg text-ink sm:text-xl"
          emptyText="Nog geen kernboodschap. Vul die in via Bewerken."
        />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {STORY_TYPES.map((t) => {
          const count = sprint.userStories.filter((u) => u.type === t).length
          if (count === 0) return null
          return (
            <span key={t} className="rounded-xl border border-line bg-bg/50 px-4 py-2 text-sm">
              <span className={cn('font-mono text-2xl font-bold', t === 'US' ? 'text-data' : t === 'RS' ? 'text-flame' : 'text-lime')}>{count}</span>{' '}
              <span className="text-muted">{STORY_TYPE_LABELS[t].many.toLowerCase()}</span>
            </span>
          )
        })}
        <span className="rounded-xl border border-line bg-bg/50 px-4 py-2 text-sm">
          <span className="font-mono text-2xl font-bold">{sprint.userStories.filter((u) => u.done).length}</span>{' '}
          <span className="text-muted">afgerond</span>
        </span>
      </div>
    </div>
  )
}

function StorySlide({ sprint, story, index }: { sprint: Sprint; story: UserStory; index: number }) {
  const { update, editMode } = usePortfolio()
  const patch = (changes: Partial<UserStory>) =>
    update((d) => {
      const s = d.sprints.find((x) => x.id === sprint.id)
      const u = s?.userStories.find((x) => x.id === story.id)
      if (u) Object.assign(u, changes)
    })

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StoryTypeBadge type={story.type} />
        <span className="font-mono text-xs text-muted">
          Story {index + 1} van {sprint.userStories.length}
        </span>
        {story.done ? (
          <span className="flex items-center gap-1 text-xs text-lime">
            <CircleCheck className="size-4" aria-hidden /> Afgerond
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-muted">
            <CircleDashed className="size-4" aria-hidden /> Nog bezig
          </span>
        )}
      </div>
      <h2 className="max-w-4xl font-display text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight font-semibold">{story.story}</h2>

      <div className="mt-6 grid flex-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-lime/30 bg-lime/[0.05] p-5">
          <SlideLabel icon={Lightbulb}>Wat ik heb geleerd</SlideLabel>
          <EditableText
            value={story.learned}
            onChange={(learned) => patch({ learned })}
            label="Wat ik heb geleerd"
            placeholder="Wat heb je met deze story geleerd?"
            multiline
            rows={5}
            className="text-lg leading-relaxed text-ink"
            emptyText="Nog niet ingevuld. Zet Bewerken aan en schrijf hier wat je hebt geleerd."
          />
          {(editMode || story.evidence.length > 0) && (
            <div className="mt-5">
              <p className="label">Bewijs</p>
              <LinkList links={story.evidence} onChange={(evidence) => patch({ evidence })} label="Bewijslink" />
            </div>
          )}
        </div>
        <div>
          <p className="label">Acceptatiecriteria</p>
          <ul className="space-y-2">
            {story.criteria.filter(Boolean).map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink/90">
                {story.done ? (
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-lime" aria-hidden />
                ) : (
                  <CircleDashed className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
                )}
                {c}
              </li>
            ))}
          </ul>
          {story.qualityCriteria.filter(Boolean).length > 0 && (
            <>
              <p className="label mt-5">Kwaliteitscriteria</p>
              <ul className="space-y-2">
                {story.qualityCriteria.filter(Boolean).map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted">
                    <span className="mt-2 h-0.5 w-3 shrink-0 bg-data" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function WrapUpSlide({ sprint }: { sprint: Sprint }) {
  const { update } = usePortfolio()
  const set = (key: 'reflection' | 'feedback' | 'nextSteps') => (v: string) =>
    update((d) => void (d.sprints.find((s) => s.id === sprint.id)![key] = v))
  const blocks = [
    { key: 'reflection' as const, icon: Sparkles, title: 'Reflectie', placeholder: 'Wat neem je mee uit deze sprint?' },
    { key: 'feedback' as const, icon: MessageSquareQuote, title: 'Feedback', placeholder: 'Welke feedback kreeg je?' },
    { key: 'nextSteps' as const, icon: Footprints, title: 'Volgende stappen', placeholder: 'Wat ga je hierna doen?' },
  ]
  return (
    <div className="flex h-full flex-col">
      <p className="kicker mb-3">Grow</p>
      <h2 className="mb-6 text-[clamp(2rem,5vw,4rem)] leading-none font-extrabold uppercase">Wat neem ik mee?</h2>
      <div className="grid flex-1 gap-4 md:grid-cols-3">
        {blocks.map((b) => (
          <div key={b.key} className="rounded-2xl border border-line bg-bg/50 p-5">
            <SlideLabel icon={b.icon}>{b.title}</SlideLabel>
            <EditableText value={sprint[b.key]} onChange={set(b.key)} label={b.title} placeholder={b.placeholder} multiline rows={5} className="leading-relaxed text-ink/90" emptyText="Nog niet ingevuld." />
          </div>
        ))}
      </div>
    </div>
  )
}

function Deck({ sprint }: { sprint: Sprint }) {
  const { data, editMode } = usePortfolio()
  const deckId = useId()
  const [[slide, direction], setSlide] = useState<[number, number]>([0, 0])
  const [fullscreen, setFullscreen] = useState(false)
  const total = sprint.userStories.length + 2
  const current = Math.min(slide, total - 1)

  const go = (to: number) => {
    const next = Math.max(0, Math.min(total - 1, to))
    setSlide([next, next > current ? 1 : -1])
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        setSlide(([s]) => [Math.min(total - 1, s + 1), 1])
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setSlide(([s]) => [Math.max(0, s - 1), -1])
      }
    }
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement))
    window.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFs)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('fullscreenchange', onFs)
    }
  }, [total])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.getElementById(deckId)?.requestFullscreen()
  }

  const label = current === 0 ? 'Titel' : current === total - 1 ? 'Afsluiting' : `Story ${current}`

  return (
    <section
      id={deckId}
      aria-roledescription="presentatie"
      aria-label={`Show & Grow sprint ${sprint.number}`}
      className={cn('deck relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface', fullscreen && 'rounded-none border-0')}
    >
      <div className="lane h-1.5 w-full shrink-0" aria-hidden />
      <div className="flex items-center justify-between gap-3 border-b border-line/70 px-5 py-3">
        <p className="font-mono text-xs text-muted" aria-live="polite">
          {pad(current + 1)} / {pad(total)} · {label}
        </p>
        <div className="flex items-center gap-1">
          {!fullscreen && editMode && (
            <span className="mr-2 hidden items-center gap-1 text-xs text-lime sm:flex">
              <Pencil className="size-3.5" aria-hidden /> Bewerkbaar
            </span>
          )}
          <IconButton icon={fullscreen ? Minimize : Maximize} label={fullscreen ? 'Volledig scherm sluiten' : 'Presenteren op volledig scherm'} onClick={toggleFullscreen} />
        </div>
      </div>

      <div className={cn('relative flex-1 overflow-y-auto', fullscreen ? 'p-[4vw]' : 'min-h-[30rem] p-6 sm:p-10')}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full"
          >
            {current === 0 ? (
              <TitleSlide sprint={sprint} name={data.profile.name} />
            ) : current === total - 1 ? (
              <WrapUpSlide sprint={sprint} />
            ) : (
              <StorySlide sprint={sprint} story={sprint.userStories[current - 1]} index={current - 1} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line/70 px-5 py-3">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => go(current - 1)} disabled={current === 0}>
          <span className="hidden sm:inline">Vorige</span>
        </Button>
        <div className="flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="Dia's">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={i === 0 ? 'Titeldia' : i === total - 1 ? 'Afsluiting' : `Story ${i}`}
              onClick={() => go(i)}
              className={cn('h-2 rounded-full transition-all', i === current ? 'w-6 bg-lime' : 'w-2 bg-line hover:bg-muted')}
            />
          ))}
        </div>
        <Button variant={current === total - 1 ? 'ghost' : 'primary'} onClick={() => go(current + 1)} disabled={current === total - 1}>
          <span className="hidden sm:inline">Volgende</span>
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </section>
  )
}

export function ShowGrowPage({ param }: { param?: string }) {
  const { data } = usePortfolio()
  const fallback = data.sprints.find((s) => s.status === 'Bezig') ?? data.sprints[0]
  const sprint = data.sprints.find((s) => String(s.number) === param) ?? fallback

  return (
    <>
      <PageHeader
        icon={Presentation}
        kicker="Show & Grow"
        title="Wat ik heb geleerd"
        path={`show-grow/${sprint.number}`}
        description="Presenteer per sprint wat je hebt geleerd aan de hand van de stories uit die sprint. Blader met de pijltjestoetsen of zet de presentatie op volledig scherm."
      />

      <nav aria-label="Kies een sprint" className="mb-6 flex flex-wrap items-center gap-2">
        {data.sprints.map((s) => (
          <a
            key={s.id}
            href={href('show-grow', s.number)}
            aria-current={s.id === sprint.id ? 'page' : undefined}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
              s.id === sprint.id ? 'border-lime bg-lime text-lime-dark' : 'border-line text-muted hover:border-lime/50 hover:text-ink',
            )}
          >
            <span className="sr-only">Sprint </span>S{s.number}
          </a>
        ))}
        <span className="ml-auto flex items-center gap-3">
          <StatusBadge status={sprint.status} />
          <a href={href('sprints', sprint.number)} className="text-sm text-muted hover:text-lime">
            Naar sprint {sprint.number} →
          </a>
        </span>
      </nav>

      <Deck key={sprint.id} sprint={sprint} />

      <p className="mt-4 text-center text-xs text-muted">
        Tip: vul per story in wat je hebt geleerd via <strong className="text-ink">Bewerken</strong>. Dat kan hier in de dia's, of op de sprintpagina.
      </p>
    </>
  )
}
