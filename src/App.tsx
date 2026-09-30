import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LoginDialog } from './components/LoginDialog'
import { NAV_ITEMS } from './components/navigation'
import { useHashRoute, type Route } from './hooks/useHashRoute'
import { usePortfolio } from './hooks/usePortfolio'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { PromptsPage } from './pages/PromptsPage'
import { ResearchPage } from './pages/ResearchPage'
import { ShowGrowPage } from './pages/ShowGrowPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { SprintsPage } from './pages/SprintsPage'
import { TimelinePage } from './pages/TimelinePage'

function Page({ route }: { route: Route }) {
  switch (route.page) {
    case 'prompts':
      return <PromptsPage param={route.param} />
    case 'show-grow':
      return <ShowGrowPage param={route.param} />
    case 'onderzoek':
      return <ResearchPage />
    case 'roadmap':
      return <RoadmapPage />
    case 'sprints':
      return <SprintsPage param={route.param} />
    case 'tijdlijn':
      return <TimelinePage />
    case 'dashboard':
      return <DashboardPage />
    default:
      return <HomePage />
  }
}

export default function App() {
  const route = useHashRoute()
  const { data } = usePortfolio()
  const routeKey = `${route.page}/${route.param ?? ''}`

  // Nieuwe pagina: terug naar boven en de documenttitel bijwerken.
  useEffect(() => {
    if (!(route.page === 'prompts' && route.param)) window.scrollTo({ top: 0 })
    const label = NAV_ITEMS.find((i) => i.id === route.page)?.label ?? 'Home'
    const suffix = (route.page === 'sprints' || route.page === 'show-grow') && route.param ? ` ${route.param}` : ''
    document.title = route.page === 'home' ? `${data.profile.name} | Portfolio` : `${label}${suffix} | ${data.profile.name}`
  }, [route.page, route.param, data.profile.name])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="sr-only z-50 rounded-lg bg-lime px-4 py-2 font-semibold text-lime-dark focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Naar de inhoud
      </a>
      <div className="flex min-h-dvh flex-col">
        <Header current={route.page} />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 outline-none sm:px-6 sm:py-12">
          <AnimatePresence mode="wait">
            <motion.div key={routeKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Page route={route} />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <LoginDialog />
      </div>
    </MotionConfig>
  )
}
