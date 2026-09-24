import { CircleCheck, CircleDashed, Lightbulb, Trash2 } from 'lucide-react'
import { usePortfolio } from '../hooks/usePortfolio'
import { cn } from '../lib/utils'
import { STORY_TYPE_LABELS, STORY_TYPES, type StoryType, type UserStory } from '../types'
import { EditableList, EditableSelect, EditableText, LinkList } from './editable'
import { Badge, IconButton } from './ui'

export function StoryTypeBadge({ type }: { type: StoryType }) {
  return (
    <Badge tone={type === 'US' ? 'data' : type === 'RS' ? 'flame' : 'lime'}>
      <span aria-hidden>{type}</span>
      <span className="sr-only">{STORY_TYPE_LABELS[type].one}</span>
    </Badge>
  )
}

interface UserStoryCardProps {
  story: UserStory
  index: number
  onChange: (changes: Partial<UserStory>) => void
  onRemove: () => void
}

/**
 * Eén story met omschrijving, acceptatie- en kwaliteitscriteria.
 * Past zich aan de beschikbare breedte aan: smal gestapeld, breed in drie kolommen.
 */
export function UserStoryCard({ story, index, onChange, onRemove }: UserStoryCardProps) {
  const { editMode } = usePortfolio()
  const n = index + 1

  return (
    <li className={cn('@container rounded-xl border p-4', story.done ? 'border-lime/30 bg-lime/[0.04]' : 'border-line bg-bg/40')}>
      <div className="mb-3 flex items-center gap-2">
        {editMode ? (
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={story.done} onChange={(e) => onChange({ done: e.target.checked })} className="size-4 accent-lime" />
            Afgerond
          </label>
        ) : story.done ? (
          <CircleCheck className="size-5 shrink-0 text-lime" aria-label="Afgerond" />
        ) : (
          <CircleDashed className="size-5 shrink-0 text-muted" aria-label="Nog niet afgerond" />
        )}
        <EditableSelect value={story.type} options={STORY_TYPES} onChange={(type) => onChange({ type })} label={`Type story ${n}`}>
          <StoryTypeBadge type={story.type} />
        </EditableSelect>
        <span className="font-mono text-xs text-muted">#{n}</span>
        {editMode && <IconButton icon={Trash2} tone="danger" label={`Story ${n} verwijderen`} onClick={onRemove} className="ml-auto" />}
      </div>

      <div className="grid gap-4 @3xl:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="label">Omschrijving</p>
          <EditableText value={story.story} onChange={(v) => onChange({ story: v })} label={`Omschrijving story ${n}`} multiline rows={3} className="font-medium text-ink" />
        </div>
        <div>
          <p className="label">Acceptatiecriteria</p>
          <EditableList items={story.criteria} onChange={(criteria) => onChange({ criteria })} label={`Acceptatiecriterium story ${n}`} variant="numbered" addLabel="Criterium toevoegen" emptyText="Nog geen acceptatiecriteria." />
        </div>
        <div>
          <p className="label">Kwaliteitscriteria</p>
          <EditableList items={story.qualityCriteria} onChange={(qualityCriteria) => onChange({ qualityCriteria })} label={`Kwaliteitscriterium story ${n}`} variant="numbered" addLabel="Criterium toevoegen" emptyText="Nog geen kwaliteitscriteria." />
        </div>
      </div>

      {(editMode || story.learned.trim() || story.evidence.length > 0) && (
        <div className="mt-4 grid gap-4 border-t border-line/70 pt-4 @3xl:grid-cols-[2fr_1fr]">
          <div>
            <p className="label flex items-center gap-1.5">
              <Lightbulb className="size-3.5 text-lime" aria-hidden /> Wat ik heb geleerd
            </p>
            <EditableText value={story.learned} onChange={(learned) => onChange({ learned })} label={`Wat ik heb geleerd bij story ${n}`} placeholder="Wat heb je met deze story geleerd? Dit komt in je Show & Grow." multiline rows={3} className="text-sm text-ink/90" emptyText="Nog niet ingevuld." />
          </div>
          <div>
            <p className="label">Bewijs</p>
            <LinkList links={story.evidence} onChange={(evidence) => onChange({ evidence })} label={`Bewijslink story ${n}`} />
          </div>
        </div>
      )}
    </li>
  )
}
