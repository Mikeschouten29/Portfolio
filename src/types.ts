export type LuId = 'LU1' | 'LU2' | 'LU3' | 'LU4' | 'LU5'

export const LU_IDS: LuId[] = ['LU1', 'LU2', 'LU3', 'LU4', 'LU5']

export interface LearningOutcome {
  id: LuId
  title: string
  description: string
  /** Minimaal aantal voldoendes dat in de hele minor nodig is */
  required: number
}

export interface Link {
  id: string
  label: string
  url: string
}

export interface Profile {
  name: string
  role: string
  intro: string
  bio: string
  education: string
  school: string
  minor: string
  minorDescription: string
  location: string
  email: string
  phone: string
  linkedin: string
  talents: string[]
  passions: string[]
  futureGoals: string[]
}

export interface Prompt {
  id: string
  title: string
  category: string
  learningOutcomes: LuId[]
  role: string
  context: string
  task: string
  output: string
  tools: string[]
  tags: string[]
}

export interface Source {
  id: string
  title: string
  author: string
  year: string
  url: string
}

/** Eén regel in een risicofiguur (bijv. de risiconiveaus van de AI-verordening). */
export interface RiskLevelRow {
  level: string
  article: string
  example: string
  note: string
  tone: 'red' | 'amber' | 'teal' | 'gray'
}

/** Eén regel in een toetsingstabel. */
export interface AssessmentRow {
  application: string
  aiAct: string
  avg: string
  ethics: string
}

/** Oordeel bij een toetsingsstap: voldoet, aandachtspunt, voldoet niet of alleen een vaststelling. */
export type Verdict = 'ok' | 'warn' | 'fail' | 'info'

export interface CaseStep {
  question: string
  finding: string
  verdict: Verdict
}

/** Een diepgaand getoetste praktijkcasus. */
export interface CaseStudy {
  title: string
  intro: string
  facts: string[]
  steps: CaseStep[]
  comparison: string
  conclusion: string
}

export interface EthicsRow {
  requirement: string
  assessment: string
  verdict: Verdict
}

export interface Stakeholder {
  name: string
  interest: string
  concern: string
}

export interface Recommendation {
  actor: string
  action: string
  basis: string
  priority: 'Hoog' | 'Middel' | 'Laag'
}

export interface Research {
  title: string
  question: string
  subQuestions: string[]
  method: string
  sources: Source[]
  results: string[]
  insights: string[]
  /** Korte aanleiding boven de hoofdvraag */
  intro?: string
  /** Label zoals "Concept" */
  status?: string
  /** Kopje boven de inzichten (standaard "Inzichten") */
  insightsLabel?: string
  riskLevels?: RiskLevelRow[]
  assessment?: AssessmentRow[]
  /** Afbeelding bij het onderzoek (pad in public/ of volledige URL) */
  image?: { src: string; alt: string; caption?: string }
  /** Actualiteit, bijv. over gewijzigde wetgeving */
  note?: string
  caseStudy?: CaseStudy
  ethicsFramework?: string
  ethics?: EthicsRow[]
  stakeholders?: Stakeholder[]
  /** Concrete aanbevelingen per partij (de algemene staan in insights) */
  recommendations?: Recommendation[]
  conclusion?: string
  limitations?: string[]
  /** Eigen standpunt van de student */
  ownPosition?: string
}

export type Priority = 'Hoog' | 'Middel' | 'Laag'
export type RoadmapType = 'Doel' | 'Project'

export interface RoadmapItem {
  id: string
  title: string
  type: RoadmapType
  description: string
  planning: string
  progress: number
  priority: Priority
}

export type SprintStatus = 'Gepland' | 'Bezig' | 'Afgerond'

/** US = user story (product), RS = onderzoeksstory, LS = leerstory (wat ik als student wil leren). */
export type StoryType = 'US' | 'RS' | 'LS'

export const STORY_TYPES: StoryType[] = ['US', 'RS', 'LS']

export const STORY_TYPE_LABELS: Record<StoryType, { one: string; many: string }> = {
  US: { one: 'User story', many: 'User stories' },
  RS: { one: 'Onderzoeksstory', many: 'Onderzoeksstories' },
  LS: { one: 'Leerstory', many: 'Leerstories' },
}

export interface UserStory {
  id: string
  type: StoryType
  story: string
  /** Acceptatiecriteria */
  criteria: string[]
  /** Kwaliteitscriteria */
  qualityCriteria: string[]
  /** Wat ik met deze story heb geleerd (voor Show & Grow) */
  learned: string
  /** Bewijs bij deze story */
  evidence: Link[]
  done: boolean
}

/** Korte, concrete punten voor de laatste Show & Grow-dia ("Wat neem ik mee?"). */
export interface SprintTakeaways {
  learned: string
  feedback: string
  next: string
}

export interface LuProgress {
  score: number
  note: string
}

export interface Sprint {
  id: string
  number: number
  title: string
  period: string
  status: SprintStatus
  goal: string
  userStories: UserStory[]
  feedback: string
  selfEvaluation: string
  learningOutcomes: Record<LuId, LuProgress>
  reflection: string
  /** Kernboodschap van de Show & Grow */
  showGrow: string
  /** Volgende stappen na deze sprint */
  nextSteps: string
  /** Korte samenvatting voor de laatste Show & Grow-dia */
  takeaways: SprintTakeaways
  evidence: Link[]
}

export interface PortfolioData {
  version: number
  profile: Profile
  learningOutcomes: LearningOutcome[]
  prompts: Prompt[]
  research: Research
  /** Extra onderzoeken (Onderzoek 2, 3, …) */
  extraResearch: Research[]
  roadmap: RoadmapItem[]
  sprints: Sprint[]
}
