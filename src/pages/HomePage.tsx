import { motion } from 'motion/react'
import {
  ArrowRight,
  BrainCircuit,
  Copy,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Sparkles,
  Target,
  UserRound,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { EditableList, EditableText, Field } from '../components/editable'
import { Card, Reveal } from '../components/ui'
import { useCopy } from '../hooks/useCopy'
import { href } from '../hooks/useHashRoute'
import { usePortfolio } from '../hooks/usePortfolio'
import { luAchievedIn } from '../lib/utils'
import { LU_IDS, type Profile } from '../types'

function LinkedinGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function Stat({ value, label, suffix }: { value: string | number; label: string; suffix?: string }) {
  return (
    <div className="rounded-xl border border-line/80 bg-bg/60 p-4">
      <p className="font-mono text-3xl font-bold text-lime tabular-nums sm:text-4xl">
        {value}
        {suffix && <span className="text-lg text-lime/70">{suffix}</span>}
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  )
}

function InfoCard({ icon: Icon, title, children, className }: { icon: LucideIcon; title: string; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <h2 className="mb-4 flex items-center gap-2.5 text-2xl font-bold uppercase">
        <span className="flex size-8 items-center justify-center rounded-lg bg-lime/10 text-lime">
          <Icon className="size-4" aria-hidden />
        </span>
        {title}
      </h2>
      {children}
    </Card>
  )
}

interface ContactRowProps {
  icon: ReactNode
  label: string
  value: string
  link: string
  onChange: (value: string) => void
}

function ContactRow({ icon, label, value, link, onChange }: ContactRowProps) {
  const { editMode } = usePortfolio()
  const copy = useCopy()
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line/70 bg-bg/40 p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-data">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="label mb-0.5">{label}</p>
        {editMode ? (
          <EditableText value={value} onChange={onChange} label={label} />
        ) : (
          <a
            href={link}
            target={link.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="block truncate text-sm text-ink hover:text-lime"
          >
            {value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
          </a>
        )}
      </div>
      {!editMode && (
        <button
          type="button"
          onClick={() => copy(value, `${label} gekopieerd`)}
          className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-lime"
          aria-label={`${label} kopiëren`}
          title={`${label} kopiëren`}
        >
          <Copy className="size-4" aria-hidden />
        </button>
      )}
    </li>
  )
}

export function HomePage() {
  const { data, update } = usePortfolio()
  const { profile, sprints } = data
  const set = <K extends keyof Profile>(key: K) => (value: Profile[K]) => update((d) => void (d.profile[key] = value))

  const doneSprints = sprints.filter((s) => s.status === 'Afgerond').length
  const luAchieved = LU_IDS.filter((id) => luAchievedIn(sprints, id).length > 0).length
  const [first, ...rest] = profile.name.split(' ')

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="grid items-center gap-8 pt-4 pb-6 lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:pt-10">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kicker mb-5 flex items-center gap-2">
            <Sparkles className="size-4" aria-hidden />
            Portfolio · Minor {profile.minor}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <EditableText
              as="h1"
              value={profile.name}
              onChange={set('name')}
              label="Naam"
              className="sr-only"
              inputClassName="mb-4 font-display text-4xl font-bold uppercase"
            />
            <p aria-hidden className="font-display text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.82] font-extrabold uppercase">
              {first}
              <br />
              <span className="text-transparent [-webkit-text-stroke:2px_var(--color-lime)]">{rest.join(' ')}</span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 max-w-xl space-y-4"
          >
            <EditableText value={profile.role} onChange={set('role')} label="Rol" className="font-mono text-sm text-data" />
            <EditableText value={profile.intro} onChange={set('intro')} label="Introductie" multiline className="text-lg text-ink/90" />
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={href('sprints')}
                className="inline-flex items-center gap-2 rounded-lg bg-lime px-5 py-3 text-sm font-semibold text-lime-dark transition-transform hover:-translate-y-0.5"
              >
                Bekijk mijn sprints <ArrowRight className="size-4" aria-hidden />
              </a>
              <a
                href={href('dashboard')}
                className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-lime/60 hover:text-lime"
              >
                <LayoutDashboard className="size-4" aria-hidden /> Dashboard
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scorebord */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          aria-label="Scorebord"
          className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5 sm:p-6"
        >
          <div className="lane absolute inset-x-0 top-0 h-2" aria-hidden />
          <div className="mb-4 flex items-center justify-between pt-1">
            <p className="kicker">Scorebord</p>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
              <span className="size-1.5 animate-pulse rounded-full bg-lime" aria-hidden /> Live
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat value={doneSprints} suffix={`/${sprints.length}`} label="Sprints afgerond" />
            <Stat value={luAchieved} suffix={`/${LU_IDS.length}`} label="Leeruitkomsten behaald" />
            <Stat value={data.prompts.length} label="Prompts in bibliotheek" />
            <Stat value={sprints.reduce((n, s) => n + s.userStories.length, 0)} label="Stories gepland" />
          </div>
          <a href={href('dashboard')} className="mt-4 flex items-center justify-end gap-1 text-sm text-muted hover:text-lime">
            Naar dashboard <ArrowRight className="size-3.5" aria-hidden />
          </a>
        </motion.aside>
      </section>

      {/* Profiel & minor */}
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <InfoCard icon={UserRound} title="Profiel" className="h-full">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Opleiding">
                <EditableText value={profile.education} onChange={set('education')} label="Opleiding" className="text-ink" />
              </Field>
              <Field label="School">
                <EditableText value={profile.school} onChange={set('school')} label="School" className="text-ink" />
              </Field>
              <Field label="Minor">
                <EditableText value={profile.minor} onChange={set('minor')} label="Minor" className="text-ink" />
              </Field>
              <Field label="Locatie">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0 text-muted" aria-hidden />
                  <EditableText as="span" value={profile.location} onChange={set('location')} label="Locatie" className="text-ink" />
                </span>
              </Field>
            </div>
          </InfoCard>
        </Reveal>
        <Reveal delay={0.05}>
          <InfoCard icon={GraduationCap} title={`Minor: ${profile.minor}`} className="h-full">
            <EditableText value={profile.minorDescription} onChange={set('minorDescription')} label="Beschrijving minor" multiline className="text-ink/90" />
            <div className="mt-5 grid grid-cols-5 gap-1.5" aria-label="Leeruitkomsten">
              {data.learningOutcomes.map((lo) => (
                <a
                  key={lo.id}
                  href={href('dashboard')}
                  title={lo.title}
                  className="rounded-lg border border-line bg-bg/50 px-1 py-2 text-center font-mono text-xs text-muted transition-colors hover:border-lime/60 hover:text-lime"
                >
                  {lo.id}
                </a>
              ))}
            </div>
          </InfoCard>
        </Reveal>
      </div>

      {/* Bio */}
      <Reveal>
        <InfoCard icon={BrainCircuit} title="Over mij">
          <EditableText value={profile.bio} onChange={set('bio')} label="Bio" multiline rows={5} className="max-w-3xl text-lg leading-relaxed text-ink/90" />
        </InfoCard>
      </Reveal>

      {/* Talenten, passies, doelen */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal>
          <InfoCard icon={Zap} title="Talenten" className="h-full">
            <EditableList items={profile.talents} onChange={set('talents')} label="Talent" variant="chips" addLabel="Talent toevoegen" />
          </InfoCard>
        </Reveal>
        <Reveal delay={0.05}>
          <InfoCard icon={Heart} title="Passies" className="h-full">
            <EditableList items={profile.passions} onChange={set('passions')} label="Passie" variant="chips" addLabel="Passie toevoegen" />
          </InfoCard>
        </Reveal>
        <Reveal delay={0.1}>
          <InfoCard icon={Target} title="Toekomstdoelen" className="h-full">
            <EditableList items={profile.futureGoals} onChange={set('futureGoals')} label="Toekomstdoel" variant="numbered" addLabel="Doel toevoegen" />
          </InfoCard>
        </Reveal>
      </div>

      {/* Contact */}
      <Reveal>
        <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-br from-surface to-surface-2 p-6 sm:p-10">
          <Rocket className="absolute -right-6 -bottom-6 size-40 text-lime/5" aria-hidden />
          <p className="kicker mb-2">Contact</p>
          <h2 id="contact-title" className="mb-6 text-4xl font-bold uppercase sm:text-5xl">
            Laten we samen <span className="text-lime">scoren</span>
          </h2>
          <ul className="relative grid gap-3 md:grid-cols-3">
            <ContactRow icon={<Mail className="size-4" />} label="E-mail" value={profile.email} link={`mailto:${profile.email}`} onChange={set('email')} />
            <ContactRow icon={<Phone className="size-4" />} label="Telefoon" value={profile.phone} link={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} onChange={set('phone')} />
            <ContactRow icon={<LinkedinGlyph className="size-4" />} label="LinkedIn" value={profile.linkedin} link={profile.linkedin} onChange={set('linkedin')} />
          </ul>
        </section>
      </Reveal>
    </div>
  )
}
