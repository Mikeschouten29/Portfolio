import { AnimatePresence, motion } from 'motion/react'
import { CalendarClock, Goal, Plus, Route, Trash2, Wrench } from 'lucide-react'
import { useState } from 'react'
import { EditableProgress, EditableSelect, EditableText } from '../components/editable'
import { PageHeader } from '../components/PageHeader'
import { Badge, Button, EmptyState, IconButton, PriorityBadge, ProgressBar } from '../components/ui'
import { usePortfolio } from '../hooks/usePortfolio'
import { useToast } from '../hooks/useToast'
import { average, cn, uid } from '../lib/utils'
import type { Priority, RoadmapItem, RoadmapType } from '../types'

const PRIORITIES: Priority[] = ['Hoog', 'Middel', 'Laag']
const TYPES: RoadmapType[] = ['Doel', 'Project']
const priorityOrder: Record<Priority, number> = { Hoog: 0, Middel: 1, Laag: 2 }

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const { editMode, update } = usePortfolio()
  const toast = useToast()
  const patch = (changes: Partial<RoadmapItem>) =>
    update((d) => {
      const it = d.roadmap.find((x) => x.id === item.id)
      if (it) Object.assign(it, changes)
    })
  const Icon = item.type === 'Doel' ? Goal : Wrench

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={cn(
        'relative rounded-2xl border border-line bg-surface/80 p-5 pl-6 sm:p-6 sm:pl-7',
        'before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-r-full',
        item.priority === 'Hoog' && 'before:bg-flame',
        item.priority === 'Middel' && 'before:bg-data',
        item.priority === 'Laag' && 'before:bg-muted/50',
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <EditableSelect value={item.type} options={TYPES} onChange={(type) => patch({ type })} label="Type">
          <Badge tone="lime">
            <Icon className="size-3" aria-hidden /> {item.type}
          </Badge>
        </EditableSelect>
        <EditableSelect value={item.priority} options={PRIORITIES} onChange={(priority) => patch({ priority })} label="Prioriteit">
          <PriorityBadge priority={item.priority} />
        </EditableSelect>
        {editMode && (
          <IconButton
            icon={Trash2}
            tone="danger"
            label="Roadmap-item verwijderen"
            className="ml-auto"
            onClick={() => {
              update((d) => void (d.roadmap = d.roadmap.filter((x) => x.id !== item.id)))
              toast('Roadmap-item verwijderd', 'info')
            }}
          />
        )}
      </div>
      <EditableText as="h2" value={item.title} onChange={(title) => patch({ title })} label="Titel" className="text-2xl leading-tight font-bold uppercase" inputClassName="font-display text-lg font-bold" />
      <EditableText value={item.description} onChange={(description) => patch({ description })} label="Omschrijving" multiline rows={2} className="mt-2 text-sm text-ink/80" inputClassName="mt-2" />
      <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
        <CalendarClock className="size-4" aria-hidden />
        <EditableText as="span" value={item.planning} onChange={(planning) => patch({ planning })} label="Planning" inputClassName="py-1 text-sm" />
      </p>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="label mb-0">Voortgang</span>
          <span className="font-mono text-lime">{item.progress}%</span>
        </div>
        <EditableProgress value={item.progress} onChange={(progress) => patch({ progress })} label={`Voortgang ${item.title}`}>
          <ProgressBar value={item.progress} label={`Voortgang ${item.title}`} tone={item.progress >= 100 ? 'lime' : 'data'} />
        </EditableProgress>
      </div>
    </motion.li>
  )
}

export function RoadmapPage() {
  const { data, editMode, update } = usePortfolio()
  const toast = useToast()
  const [type, setType] = useState<RoadmapType | null>(null)

  const items = data.roadmap
    .filter((i) => !type || i.type === type)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const add = () => {
    update(
      (d) =>
        void d.roadmap.push({
          id: uid('rm'),
          title: 'Nieuw doel',
          type: type ?? 'Doel',
          description: '',
          planning: '',
          progress: 0,
          priority: 'Middel',
        }),
    )
    toast('Roadmap-item toegevoegd')
  }

  const stats = PRIORITIES.map((p) => ({ p, count: data.roadmap.filter((i) => i.priority === p).length }))

  return (
    <>
      <PageHeader
        icon={Route}
        kicker="Roadmap"
        title="Waar ik naartoe werk"
        path="roadmap"
        description="Mijn doelen en projecten met planning, voortgang en prioriteit. De belangrijkste staan bovenaan."
        actions={editMode && <Button variant="primary" icon={Plus} onClick={add}>Item toevoegen</Button>}
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="label">Totale voortgang</p>
          <p className="font-mono text-3xl font-bold text-lime">{average(data.roadmap.map((i) => i.progress))}%</p>
        </div>
        {stats.map(({ p, count }) => (
          <div key={p} className="rounded-2xl border border-line bg-surface p-4">
            <p className="label">Prioriteit {p.toLowerCase()}</p>
            <p className="font-mono text-3xl font-bold">{count}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter op type">
        {[null, ...TYPES].map((t) => (
          <button
            key={t ?? 'alle'}
            type="button"
            aria-pressed={type === t}
            onClick={() => setType(t)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              type === t ? 'border-lime bg-lime text-lime-dark' : 'border-line text-muted hover:text-ink',
            )}
          >
            {t ? `${t}en` : 'Alles'}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Route} title="Nog geen items">Zet de bewerkmodus aan om doelen en projecten toe te voegen.</EmptyState>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <RoadmapCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </>
  )
}
