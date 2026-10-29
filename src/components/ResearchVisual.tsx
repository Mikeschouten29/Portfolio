import { AnimatePresence, motion } from 'motion/react'
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Cctv,
  CircleCheck,
  CircleX,
  Cpu,
  Database,
  DoorOpen,
  Eye,
  Info,
  ListX,
  Lock,
  Maximize,
  Megaphone,
  Minimize,
  Scale,
  ScanFace,
  Sprout,
  Stethoscope,
  TriangleAlert,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { cn } from '../lib/utils'
import type { Research, RiskLevelRow, Verdict, VisualIcon } from '../types'
import { Button, IconButton } from './ui'

const icons: Record<VisualIcon, LucideIcon> = {
  activity: Activity,
  sprout: Sprout,
  stethoscope: Stethoscope,
  megaphone: Megaphone,
  'scan-face': ScanFace,
  'user-check': UserCheck,
  database: Database,
  eye: Eye,
  scale: Scale,
}

const tone: Record<RiskLevelRow['tone'], { box: string; dot: string; text: string }> = {
  gray: { box: 'border-line bg-surface-2', dot: 'bg-muted', text: 'text-muted' },
  teal: { box: 'border-data/40 bg-data/10', dot: 'bg-data', text: 'text-data' },
  amber: { box: 'border-flame/40 bg-flame/10', dot: 'bg-flame', text: 'text-flame' },
  red: { box: 'border-danger/40 bg-danger/10', dot: 'bg-danger', text: 'text-danger' },
}

/** Wat de AI-verordening per risiconiveau vraagt. */
const riskRule: Record<RiskLevelRow['tone'], string> = {
  red: 'Mag niet',
  amber: 'Strenge eisen, mens kijkt mee',
  teal: 'Melden dat het AI is',
  gray: 'Geen extra regels',
}

const verdictIcon: Record<Verdict, { icon: LucideIcon; cls: string; label: string }> = {
  ok: { icon: CircleCheck, cls: 'text-lime', label: 'voldoet' },
  warn: { icon: TriangleAlert, cls: 'text-flame', label: 'aandachtspunt' },
  fail: { icon: CircleX, cls: 'text-danger', label: 'voldoet niet' },
  info: { icon: Info, cls: 'text-data', label: 'vastgesteld' },
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
}

function SlideTitle({ kicker, children }: { kicker?: string; children: ReactNode }) {
  return (
    <div className="mb-6 text-center sm:mb-8">
      {kicker && <p className="kicker mb-2">{kicker}</p>}
      <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] leading-none font-extrabold uppercase">{children}</h2>
    </div>
  )
}

/** Eén blok in de stroom van de casus. */
function FlowStep({ icon: Icon, text, sub, warn }: { icon: LucideIcon; text: string; sub?: string; warn?: boolean }) {
  return (
    <div
      className={cn(
        'flex w-full max-w-[11rem] flex-col items-center gap-2 rounded-2xl border p-4 text-center',
        warn ? 'border-dashed border-flame/60 bg-flame/10' : 'border-line bg-bg/50',
      )}
    >
      <Icon className={cn('size-8', warn ? 'text-flame' : 'text-lime')} aria-hidden />
      <span className="text-sm font-medium text-ink">{text}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
      {warn && <span className="text-xs font-medium text-flame">ontbreekt nu</span>}
    </div>
  )
}

function FlowArrow() {
  return (
    <>
      <ArrowRight className="hidden size-6 shrink-0 text-muted sm:block" aria-hidden />
      <ArrowDown className="size-6 shrink-0 text-muted sm:hidden" aria-hidden />
    </>
  )
}

interface Slide {
  id: string
  label: string
  render: () => ReactNode
}

function buildSlides(r: Research): Slide[] {
  const v = r.visual!
  const steps = r.caseStudy?.steps ?? []
  const slides: Slide[] = [
    {
      id: 'vraag',
      label: 'De vraag',
      render: () => (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="kicker mb-4">{r.title}</p>
          <h2 className="max-w-3xl text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.95] font-extrabold uppercase">
            Wanneer is AI in de sport <span className="text-lime">verantwoord</span>?
          </h2>
          <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { t: 'Privacy', q: 'Wie ziet mijn gegevens?' },
              { t: 'Bias', q: 'Is het eerlijk voor iedereen?' },
              { t: 'Transparantie', q: 'Weet ik dat het AI is?' },
            ].map(({ t, q }) => (
              <div key={t} className="rounded-2xl border border-line bg-bg/50 px-5 py-3">
                <p className="text-lg font-semibold">{t}</p>
                <p className="text-sm text-muted">{q}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">Literatuuronderzoek · 5 werkvelden · 1 echte casus</p>
        </div>
      ),
    },
    {
      id: 'wetten',
      label: 'Twee wetten',
      render: () => (
        <div className="flex h-full flex-col justify-center">
          <SlideTitle kicker="De regels">Twee wetten</SlideTitle>
          <div className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2">
            {[
              { icon: Cpu, name: 'AI-verordening', q: 'Hoe riskant is de AI?', points: ['Vier risiconiveaus', 'Hoog risico: een mens moet meekijken'] },
              { icon: Lock, name: 'AVG', q: 'Wat gebeurt er met de gegevens?', points: ['Gezondheid en gezicht: extra streng', 'Alleen verzamelen wat nodig is'] },
            ].map((w) => (
              <div key={w.name} className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-bg/50 p-6 text-center">
                <w.icon className="size-12 text-lime" aria-hidden />
                <p className="font-display text-3xl font-bold uppercase">{w.name}</p>
                <p className="text-lg text-muted">{w.q}</p>
                <ul className="mt-1 w-full space-y-1.5 border-t border-line/60 pt-3 text-sm text-ink">
                  {w.points.map((p) => (
                    <li key={p} className="flex items-center justify-center gap-2">
                      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-lime" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted">Allebei Europese wetten: ze gelden ook in Nederland</p>
        </div>
      ),
    },
    {
      id: 'risico',
      label: 'Risico-verkeerslicht',
      render: () => (
        <div className="flex h-full flex-col justify-center">
          <SlideTitle kicker="AI-verordening">Het risico-verkeerslicht</SlideTitle>
          <ol className="mx-auto w-full max-w-3xl space-y-2">
            {(r.riskLevels ?? []).map((row) => (
              <li key={row.level} className={cn('flex items-center gap-4 rounded-xl border px-4 py-3', tone[row.tone].box)}>
                <span className={cn('size-5 shrink-0 rounded-full', tone[row.tone].dot)} aria-hidden />
                <span className={cn('w-40 shrink-0 font-display text-xl font-bold uppercase sm:w-48', tone[row.tone].text)}>
                  {row.level.replace(' risico', '')}
                </span>
                <span className="flex-1 text-sm text-ink sm:text-base">{row.example}</span>
                <span className={cn('hidden shrink-0 text-right text-xs font-medium sm:block', tone[row.tone].text)}>{riskRule[row.tone]}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-center text-xs text-muted">Verboden: al sinds februari 2025 · Hoog risico: vanaf 2 december 2027</p>
        </div>
      ),
    },
    {
      id: 'werkvelden',
      label: 'Vijf werkvelden',
      render: () => (
        <div className="flex h-full flex-col justify-center">
          <SlideTitle kicker="Deel 1">Vijf werkvelden</SlideTitle>
          <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {v.werkvelden.map((w) => {
              const Icon = icons[w.icon]
              return (
                <li key={w.name} className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 text-center', tone[w.risk].box)}>
                  <Icon className={cn('size-9', tone[w.risk].text)} aria-hidden />
                  <span className="font-display text-lg leading-tight font-bold uppercase">{w.name}</span>
                  {w.example && <span className="text-xs text-muted">{w.example}</span>}
                  <span className={cn('mt-auto rounded-full px-2.5 py-0.5 text-xs font-semibold', tone[w.risk].text)}>{w.keyword}</span>
                  {w.issue && <span className="text-xs leading-snug text-ink">{w.issue}</span>}
                </li>
              )
            })}
          </ul>
          <p className="mt-4 text-center text-xs text-muted">Kleur = hoogste risico dat kan voorkomen</p>
        </div>
      ),
    },
    {
      id: 'casus',
      label: 'Casus Brøndby IF',
      render: () => (
        <div className="flex h-full flex-col justify-center">
          <SlideTitle kicker="Deel 2 · casus">Brøndby IF</SlideTitle>
          <ul className="mx-auto mb-6 flex max-w-4xl flex-wrap justify-center gap-2 text-xs sm:text-sm">
            {['Deense voetbalclub', 'Sinds 2019', 'Toestemming van de toezichthouder', '9 strenge voorwaarden'].map((f) => (
              <li key={f} className="rounded-full border border-line bg-bg/50 px-3 py-1 text-ink">
                {f}
              </li>
            ))}
          </ul>
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <FlowStep icon={Cctv} text="Camera bij de ingang" sub="Scant elk gezicht" />
            <FlowArrow />
            <FlowStep icon={ListX} text="Vergelijk met lijst stadionverboden" sub="Geen match? Meteen gewist" />
            <FlowArrow />
            <FlowStep icon={UserCheck} text="Steward controleert" sub="Verplicht vanaf 2027" warn />
            <FlowArrow />
            <FlowStep icon={DoorOpen} text="Binnen of geweigerd" sub="Bezwaar? Niet geregeld" />
          </div>
        </div>
      ),
    },
    {
      id: 'toets',
      label: 'Negen vragen',
      render: () => (
        <div className="flex h-full flex-col justify-center">
          <SlideTitle kicker="Getoetst">Negen vragen</SlideTitle>
          <ol className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {steps.map((s, i) => {
              const vi = verdictIcon[s.verdict]
              return (
                <li
                  key={s.question}
                  className={cn('flex items-start gap-2.5 rounded-xl border bg-bg/50 p-3 text-left', s.verdict === 'warn' ? 'border-flame/50' : 'border-line')}
                >
                  <vi.icon className={cn('mt-0.5 size-6 shrink-0', vi.cls)} aria-label={vi.label} />
                  <span className="min-w-0">
                    <span className="block text-[0.65rem] tracking-wide text-muted uppercase">{i < 4 ? 'AI-verordening' : 'AVG'}</span>
                    <span className="block text-sm font-semibold text-ink">
                      {i + 1}. {s.label ?? s.question}
                    </span>
                    {s.short && <span className="block text-xs text-muted">{s.short}</span>}
                  </span>
                </li>
              )
            })}
          </ol>
          <p className="mt-4 flex justify-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <CircleCheck className="size-3.5 text-lime" aria-hidden /> voldoet
            </span>
            <span className="flex items-center gap-1">
              <TriangleAlert className="size-3.5 text-flame" aria-hidden /> aandachtspunt
            </span>
            <span className="flex items-center gap-1">
              <Info className="size-3.5 text-data" aria-hidden /> vastgesteld
            </span>
          </p>
        </div>
      ),
    },
    {
      id: 'afweging',
      label: 'De afweging',
      render: () => (
        <div className="flex h-full flex-col justify-center">
          <SlideTitle kicker="Ethiek">De afweging</SlideTitle>
          <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="flex size-20 items-center justify-center rounded-full border border-lime/50 bg-lime/10">
                <Cctv className="size-9 text-lime" aria-hidden />
              </span>
              <span className="font-display text-2xl font-bold uppercase">Veiligheid</span>
              <span className="max-w-[12rem] text-xs text-muted">Mensen met een stadionverbod buiten houden</span>
            </div>
            <Scale className="size-14 shrink-0 text-muted" aria-hidden />
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="flex size-20 items-center justify-center rounded-full border border-data/50 bg-data/10">
                <Lock className="size-9 text-data" aria-hidden />
              </span>
              <span className="font-display text-2xl font-bold uppercase">Privacy</span>
              <span className="max-w-[12rem] text-xs text-muted">Duizenden onschuldige fans gescand, en AI maakt fouten</span>
            </div>
          </div>
          <div className="mx-auto mt-8 grid w-full max-w-xl grid-cols-2 gap-3">
            <div className="flex items-start gap-2 rounded-xl border border-lime/40 bg-lime/10 p-3">
              <CircleCheck className="size-6 shrink-0 text-lime" aria-hidden />
              <span>
                <span className="block text-sm font-medium">Denemarken: mag, onder voorwaarden</span>
                <span className="block text-xs text-muted">Toezichthouder geeft vooraf toestemming</span>
              </span>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 p-3">
              <CircleX className="size-6 shrink-0 text-danger" aria-hidden />
              <span>
                <span className="block text-sm font-medium">Nederland: waarschijnlijk niet</span>
                <span className="block text-xs text-muted">Biometrie alleen als het echt nodig is</span>
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'advies',
      label: 'Mijn advies',
      render: () => (
        <div className="flex h-full flex-col justify-center">
          <SlideTitle kicker="Deel 3">Mijn advies</SlideTitle>
          <ul className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {v.advice.map((a) => {
              const Icon = icons[a.icon]
              return (
                <li key={a.text} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-bg/50 p-5 text-center">
                  {a.theme && <span className="text-[0.65rem] font-semibold tracking-wide text-lime uppercase">{a.theme}</span>}
                  <Icon className="size-10 text-lime" aria-hidden />
                  <span className="font-medium text-ink">{a.text}</span>
                  {a.why && <span className="text-xs text-muted">{a.why}</span>}
                </li>
              )
            })}
          </ul>
        </div>
      ),
    },
    ...(v.standpunt
      ? [
          {
            id: 'standpunt',
            label: 'Mijn standpunt',
            render: () => (
              <div className="flex h-full flex-col justify-center">
                <SlideTitle kicker="Mijn standpunt">Gezichtsherkenning in Nederland?</SlideTitle>
                <p className="mx-auto mb-6 rounded-full border border-lime/50 bg-lime/10 px-6 py-2 font-display text-2xl font-bold text-lime uppercase">
                  {v.standpunt!.answer}
                </p>
                <ul className="mx-auto grid w-full max-w-3xl gap-2 sm:grid-cols-2">
                  {v.standpunt!.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 rounded-xl border border-line bg-bg/50 px-4 py-3 text-sm text-ink">
                      <CircleCheck className="size-5 shrink-0 text-lime" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          },
        ]
      : []),
    {
      id: 'conclusie',
      label: 'Conclusie',
      render: () => (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="kicker mb-4">Conclusie</p>
          <p className="max-w-3xl font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1] font-extrabold uppercase">{v.oneLiner}</p>
        </div>
      ),
    },
  ]
  return slides
}

/** Visuele presentatie van een onderzoek: weinig tekst, veel beeld, met een korte uitleg onder elke dia. */
export function ResearchVisual({ research }: { research: Research }) {
  const slides = buildSlides(research)
  const deckId = useId()
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0])
  const [fullscreen, setFullscreen] = useState(false)
  const total = slides.length
  const current = Math.min(index, total - 1)
  const slide = slides[current]

  const go = (to: number) => {
    const next = Math.max(0, Math.min(total - 1, to))
    setIndex([next, next > current ? 1 : -1])
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        setIndex(([i]) => [Math.min(total - 1, i + 1), 1])
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setIndex(([i]) => [Math.max(0, i - 1), -1])
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

  const caption = research.visual?.captions?.[slide.id]

  return (
    <section
      id={deckId}
      aria-roledescription="presentatie"
      aria-label={`Visuele samenvatting: ${research.title}`}
      className={cn('flex flex-col overflow-hidden rounded-3xl border border-line bg-surface', fullscreen && 'rounded-none border-0')}
    >
      <div className="lane h-1.5 w-full shrink-0" aria-hidden />
      <div className="flex items-center justify-between gap-3 border-b border-line/70 px-4 py-2.5">
        <p className="font-mono text-xs text-muted" aria-live="polite">
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {slide.label}
        </p>
        <div className="flex items-center gap-1">
          <IconButton icon={fullscreen ? Minimize : Maximize} label={fullscreen ? 'Volledig scherm sluiten' : 'Presenteren op volledig scherm'} onClick={toggleFullscreen} />
        </div>
      </div>

      <div className={cn('relative flex-1 overflow-y-auto', fullscreen ? 'p-[4vw]' : 'min-h-[28rem] p-5 sm:p-8')}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full"
          >
            {slide.render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {caption && (
        <p className="mx-auto w-full max-w-3xl border-t border-line/50 px-5 py-3 text-center text-sm leading-relaxed text-muted" aria-live="polite">
          {caption}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-line/70 px-4 py-2.5">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => go(current - 1)} disabled={current === 0}>
          <span className="hidden sm:inline">Vorige</span>
        </Button>
        <div className="flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="Dia's">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={s.label}
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
