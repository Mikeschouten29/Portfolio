import {
  CalendarRange,
  Flag,
  House,
  LayoutDashboard,
  Library,
  Microscope,
  Presentation,
  Route as RouteIcon,
  type LucideIcon,
} from 'lucide-react'
import type { PageId } from '../hooks/useHashRoute'

export interface NavItem {
  id: PageId
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'prompts', label: 'Prompts', icon: Library },
  { id: 'show-grow', label: 'Show & Grow', icon: Presentation },
  { id: 'onderzoek', label: 'Onderzoek', icon: Microscope },
  { id: 'roadmap', label: 'Roadmap', icon: RouteIcon },
  { id: 'sprints', label: 'Sprints', icon: Flag },
  { id: 'tijdlijn', label: 'Tijdlijn', icon: CalendarRange },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
]
