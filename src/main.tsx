import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { PortfolioProvider } from './context/PortfolioProvider'
import { ToastProvider } from './context/ToastProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </ToastProvider>
  </StrictMode>,
)
