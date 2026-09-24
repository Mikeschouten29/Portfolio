import { useContext } from 'react'
import { PortfolioContext } from '../context/portfolioContext'

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio moet binnen PortfolioProvider gebruikt worden')
  return ctx
}
