import { createClient } from '@supabase/supabase-js'
import type { PortfolioData } from '../types'

// De waarden komen uit .env (lokaal) of uit de Environment Variables in Vercel (live).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** null zolang er geen anon key is ingesteld: de site werkt dan alleen met LocalStorage. */
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const cloudEnabled = supabase !== null

/** Het hele portfolio staat als één JSON-document in de tabel `portfolio`, rij `main`. */
const TABLE = 'portfolio'
const ROW_ID = 'main'

export async function fetchRemote(): Promise<unknown | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from(TABLE).select('data').eq('id', ROW_ID).maybeSingle()
  if (error) throw new Error(explain(error.message))
  return data?.data ?? null
}

export async function saveRemote(portfolio: PortfolioData): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: ROW_ID, data: portfolio, updated_at: new Date().toISOString() })
  if (error) throw new Error(explain(error.message))
}

/** Vertaalt de meest voorkomende Supabase-fouten naar begrijpelijk Nederlands. */
function explain(message: string): string {
  if (/relation .* does not exist|Could not find the table/i.test(message)) {
    return 'De tabel "portfolio" bestaat nog niet. Voer supabase/schema.sql uit in de SQL Editor.'
  }
  if (/row-level security|permission denied/i.test(message)) {
    return 'Geen toestemming om op te slaan. Ben je ingelogd met het juiste e-mailadres?'
  }
  if (/Invalid API key|JWT/i.test(message)) {
    return 'De Supabase-sleutel klopt niet. Controleer VITE_SUPABASE_ANON_KEY.'
  }
  if (/Failed to fetch|NetworkError/i.test(message)) {
    return 'Geen verbinding met Supabase. Controleer je internet.'
  }
  return message
}
