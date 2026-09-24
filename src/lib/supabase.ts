import { createClient } from '@supabase/supabase-js'

// De Supabase-koppeling staat klaar voor later gebruik (bijv. data online opslaan).
// Op dit moment bewaart de site alles in LocalStorage.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && anonKey ? createClient(url, anonKey) : null
