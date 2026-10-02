import {
  minorLearningOutcomes,
  researchContent,
  sampleData,
  sprint1Content,
  sprint1Planning,
  sprint2Content,
  sprint2Planning,
  storyLearned,
  supabasePrompt,
  youngOnesRoadmapItem,
  youngOnesStory,
} from '../data/sampleData'
import type { PortfolioData, UserStory } from '../types'

export const STORAGE_KEY = 'portfolio-mike-schouten:v1'
export const DATA_VERSION = 13

export function isPortfolioData(value: unknown): value is PortfolioData {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.profile === 'object' &&
    v.profile !== null &&
    Array.isArray(v.learningOutcomes) &&
    Array.isArray(v.prompts) &&
    typeof v.research === 'object' &&
    v.research !== null &&
    Array.isArray(v.roadmap) &&
    Array.isArray(v.sprints)
  )
}

/** Brengt oudere opgeslagen of geïmporteerde data naar de huidige structuur. */
export function migrate(data: PortfolioData): PortfolioData {
  const d = structuredClone(data) as PortfolioData & { showGrow?: unknown }
  const oldVersion = d.version ?? 1

  for (const sprint of d.sprints) {
    sprint.nextSteps ??= ''
    sprint.takeaways ??= { learned: '', feedback: '', next: '' }
    sprint.userStories = sprint.userStories.map((u) => {
      const p = u as Partial<UserStory>
      return {
        ...u,
        type: p.type ?? 'US',
        qualityCriteria: p.qualityCriteria ?? [],
        learned: p.learned ?? '',
        evidence: p.evidence ?? [],
      }
    })
  }

  if (oldVersion < 2) {
    // v2: de planning van sprint 2 vervangt de oude voorbeeld-stories; Show & Grow-lijst vervalt.
    const sprint2 = d.sprints.find((s) => s.number === 2)
    const onlySampleStories = sprint2?.userStories.every((u) => u.id.startsWith('s2-us'))
    if (sprint2 && onlySampleStories) sprint2.userStories = structuredClone(sprint2Planning)
    delete d.showGrow
  }

  if (oldVersion < 3) {
    // v3: echte contactgegevens, alleen als de voorbeeldwaarden nog niet zijn aangepast.
    const p = d.profile
    if (p.email === 'naam@voorbeeld.nl') p.email = sampleData.profile.email
    if (p.phone === '+31 6 00000000') p.phone = sampleData.profile.phone
    if (p.linkedin === 'https://www.linkedin.com/in/') p.linkedin = sampleData.profile.linkedin
  }

  if (oldVersion < 4) {
    // v4: planning sprint 1 (US, RS, LS), opleiding Sportkunde en de minornaam "Future-proof met AI!".
    const sprint1 = d.sprints.find((s) => s.number === 1)
    if (sprint1?.userStories.every((u) => u.id.startsWith('s1-us'))) sprint1.userStories = structuredClone(sprint1Planning)

    const p = d.profile
    if (p.education === 'Sport, Management & Ondernemen (hbo)') p.education = sampleData.profile.education
    if (p.role === 'Student sport & data · AI-ontdekker') p.role = sampleData.profile.role
    if (p.minor === 'Futureproof met AI!') p.minor = sampleData.profile.minor
    p.intro = p.intro.replace('minor Futureproof met AI!', 'minor Future-proof met AI!')
    for (const r of d.roadmap) r.title = r.title.replace('Minor Futureproof met AI!', 'Minor Future-proof met AI!')
  }

  if (oldVersion < 5 && d.profile.school === 'Hogeschool — pas aan naar jouw school') {
    // v5: school ingevuld.
    d.profile.school = sampleData.profile.school
  }

  if (oldVersion < 6 && !d.prompts.some((p) => p.id === supabasePrompt.id)) {
    // v6: prompt voor de Supabase-koppeling bovenaan de Prompt Library.
    d.prompts.unshift(structuredClone(supabasePrompt))
  }

  if (oldVersion < 7) {
    // v7: Supabase-prompt in eenvoudigere, eigen woorden, alleen als de eerste versie nog ongewijzigd is.
    const i = d.prompts.findIndex((p) => p.id === supabasePrompt.id)
    if (i >= 0 && d.prompts[i].role.startsWith('Je bent een ervaren full-stack developer en een geduldige docent')) {
      d.prompts[i] = structuredClone(supabasePrompt)
    }
  }

  if (oldVersion < 8) {
    // v8: sprint 2 volgens het sprintformulier en de echte leeruitkomsten van de minor.
    // Alleen velden die nog de oude voorbeeldtekst bevatten worden vervangen.
    const s2 = d.sprints.find((s) => s.number === 2)
    if (s2) {
      const c = sprint2Content
      if (s2.title === 'Prompting in de sport') s2.title = c.title
      if (s2.goal === 'Een eigen promptbibliotheek bouwen voor sportmarketingvraagstukken.') s2.goal = c.goal
      if (s2.feedback === 'Energieke pitch. Werk aan minder tekst op je slides.') s2.feedback = c.feedback
      if (s2.selfEvaluation.startsWith('Het schrijven van prompts gaat steeds beter')) s2.selfEvaluation = c.selfEvaluation
      if (!s2.reflection.trim()) s2.reflection = c.reflection
      if (!s2.nextSteps.trim()) s2.nextSteps = c.nextSteps
      if (s2.showGrow === 'Pitch “Data als twaalfde man”.') s2.showGrow = c.showGrow
      const oldScores = [55, 50, 20, 25, 45]
      const ids = ['LU1', 'LU2', 'LU3', 'LU4', 'LU5'] as const
      if (ids.every((id, i) => s2.learningOutcomes[id]?.score === oldScores[i] && !s2.learningOutcomes[id]?.note)) {
        s2.learningOutcomes = structuredClone(c.learningOutcomes)
      }
      if (!s2.userStories.some((u) => u.id === youngOnesStory.id)) s2.userStories.push(structuredClone(youngOnesStory))
    }
    if (d.learningOutcomes[0]?.title === 'AI-geletterdheid') d.learningOutcomes = structuredClone(minorLearningOutcomes)
  }

  if (oldVersion < 9) {
    // v9: 'Wat ik heb geleerd' bij de Young Ones-story, alleen als het nog leeg is.
    const story = d.sprints.find((s) => s.number === 2)?.userStories.find((u) => u.id === youngOnesStory.id)
    if (story && !story.learned.trim()) story.learned = youngOnesStory.learned
  }

  if (oldVersion < 10) {
    // v10: korte, concrete 'Wat ik heb geleerd' per story van sprint 1 en 2.
    // Vervangt alleen lege velden of de eerdere, lange Young Ones-tekst.
    const oldLong = 'Ik heb geleerd hoe ik met AI een eigen webapp bouw'
    for (const sprint of d.sprints) {
      for (const story of sprint.userStories) {
        const text = storyLearned[story.id]
        if (text && (!story.learned.trim() || story.learned.startsWith(oldLong))) story.learned = text
      }
    }
  }

  if (oldVersion < 11) {
    // v11: sprint 1 volgens het sprintformulier, sprint 1 en 2 afgerond, echt onderzoek en roadmap,
    // en neutrale titels voor de nog niet geplande sprints. Alleen voorbeeldteksten worden vervangen.
    const s1 = d.sprints.find((s) => s.number === 1)
    if (s1) {
      const c = sprint1Content
      if (s1.title === 'Kick-off & AI-basis') s1.title = c.title
      if (s1.goal === 'Kennismaken met generatieve AI en een persoonlijk leerplan opstellen.') s1.goal = c.goal
      if (s1.feedback.startsWith('Goede start. Maak je leerdoelen')) s1.feedback = c.feedback
      if (s1.selfEvaluation.startsWith('Ik heb veel geleerd over hoe AI werkt')) s1.selfEvaluation = c.selfEvaluation
      if (s1.reflection.startsWith('AI is geen zoekmachine')) s1.reflection = c.reflection
      if (!s1.nextSteps.trim()) s1.nextSteps = c.nextSteps
      if (s1.showGrow === 'Leerplan gepresenteerd aan de groep.') s1.showGrow = c.showGrow
      if (s1.learningOutcomes.LU1?.score === 40 && s1.learningOutcomes.LU2?.score === 20) s1.learningOutcomes = structuredClone(c.learningOutcomes)
      s1.evidence = s1.evidence.filter((e) => !e.url.includes('example.com'))
      s1.status = 'Afgerond'
      for (const u of s1.userStories) if (u.id.startsWith('s1-plan-')) u.done = true
    }

    const s2 = d.sprints.find((s) => s.number === 2)
    if (s2) {
      if (s2.reflection.startsWith('Website & huisstijl: ik heb geleerd')) s2.reflection = sprint2Content.reflection
      s2.status = 'Afgerond'
      for (const u of s2.userStories) if (u.id.startsWith('s2-plan-')) u.done = true
    }

    const placeholders: Record<number, string> = {
      3: 'Onderzoeksopzet',
      4: 'Data verzamelen',
      5: 'Prototype bouwen',
      6: 'Testen & ethiek',
      7: 'Resultaten & advies',
      8: 'Eindpresentatie',
    }
    for (const s of d.sprints) {
      if (placeholders[s.number] && s.title === placeholders[s.number]) {
        s.title = 'Nog te plannen'
        s.goal = ''
      }
    }

    if (d.research.question.startsWith('Hoe kunnen Nederlandse amateursportclubs')) d.research = structuredClone(researchContent)

    for (const r of d.roadmap) {
      if (r.id === 'r1' && r.progress === 20) r.progress = 25
      if (r.description === 'Onderzoek afronden en de resultaten presenteren aan een sportclub.') {
        r.description = 'Mijn onderzoek naar AI in marketing, sponsoring en fan-engagement verder uitwerken en onderbouwen met bronnen.'
      }
    }
    const r3 = d.roadmap.findIndex((r) => r.title === 'AI-contentplanner doorontwikkelen')
    if (r3 >= 0) d.roadmap[r3] = { ...youngOnesRoadmapItem }
  }

  if (oldVersion < 12) {
    // v12: behaalde leeruitkomsten als 'behaald' (100) i.p.v. 60%, en korte 'Wat neem ik mee'-teksten voor de Show & Grow.
    const same = (s: (typeof d.sprints)[number], scores: number[]) =>
      (['LU1', 'LU2', 'LU3', 'LU4', 'LU5'] as const).every((id, i) => (s.learningOutcomes[id]?.score ?? 0) === scores[i])
    const s1 = d.sprints.find((s) => s.number === 1)
    if (s1 && same(s1, [60, 0, 0, 60, 60])) s1.learningOutcomes = structuredClone(sprint1Content.learningOutcomes)
    const s2 = d.sprints.find((s) => s.number === 2)
    if (s2 && same(s2, [0, 60, 0, 60, 60])) s2.learningOutcomes = structuredClone(sprint2Content.learningOutcomes)
    const empty = (t: { learned: string; feedback: string; next: string }) => !t.learned.trim() && !t.feedback.trim() && !t.next.trim()
    if (s1 && empty(s1.takeaways)) s1.takeaways = structuredClone(sprint1Content.takeaways)
    if (s2 && empty(s2.takeaways)) s2.takeaways = structuredClone(sprint2Content.takeaways)
  }

  if (oldVersion < 13) {
    // v13: minimaal aantal voldoendes per leeruitkomst en de officiële namen uit de minor.
    const oldTitles = ['AI-impact op de beroepspraktijk', 'Praktijkgerichte AI-oplossing', 'Ethiek & verantwoord AI-gebruik', 'AI-tools & technieken', 'Zelfstandig & zelfsturend werken']
    d.learningOutcomes = d.learningOutcomes.map((lo) => {
      const official = minorLearningOutcomes.find((m) => m.id === lo.id)
      if (!official) return lo
      const next = { ...lo, required: lo.required ?? official.required }
      if (oldTitles.includes(lo.title)) Object.assign(next, { title: official.title, description: official.description })
      return next
    })
  }

  d.version = DATA_VERSION
  return d
}

export function loadData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isPortfolioData(parsed)) return migrate(parsed)
    }
  } catch {
    // Opslag niet beschikbaar of beschadigd: val terug op voorbeelddata.
  }
  return structuredClone(sampleData)
}

export function saveData(data: PortfolioData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function downloadJson(data: PortfolioData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `portfolio-mike-schouten-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function readJsonFile(file: File): Promise<PortfolioData> {
  const parsed: unknown = JSON.parse(await file.text())
  if (!isPortfolioData(parsed)) {
    throw new Error('Dit bestand heeft niet de juiste portfolio-structuur.')
  }
  return migrate(parsed)
}
