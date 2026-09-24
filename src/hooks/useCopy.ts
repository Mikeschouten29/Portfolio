import { useCallback } from 'react'
import { copyText } from '../lib/clipboard'
import { useToast } from './useToast'

export function useCopy() {
  const toast = useToast()
  return useCallback(
    async (text: string, successMessage = 'Gekopieerd naar klembord') => {
      const ok = await copyText(text)
      toast(ok ? successMessage : 'Kopiëren is niet gelukt', ok ? 'success' : 'error')
    },
    [toast],
  )
}
