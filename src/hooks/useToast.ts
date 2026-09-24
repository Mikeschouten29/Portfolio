import { useContext } from 'react'
import { ToastContext } from '../context/toastContext'

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast moet binnen ToastProvider gebruikt worden')
  return ctx.toast
}
