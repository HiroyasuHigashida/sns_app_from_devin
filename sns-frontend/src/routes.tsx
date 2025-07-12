import { createRootRoute, createRoute, createRouter, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { TimelinePage } from './pages/TimelinePage'
import { ProfilePage } from './pages/ProfilePage'
import { Layout } from './components/Layout'

const RootComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const activePage = location.pathname === '/' ? 'home' : 'profile'
  
  const handleNavigate = (page: string, username?: string) => {
    if (page === "home") {
      navigate({ to: '/' })
    } else if (page === "profile" && username) {
      navigate({ to: '/profile/$username', params: { username } })
    }
  }
  
  return <Layout activePage={activePage} onNavigate={handleNavigate}><Outlet /></Layout>
}

const rootRoute = createRootRoute({
  component: RootComponent,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TimelinePage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$username',
  component: ProfilePage,
})

const routeTree = rootRoute.addChildren([indexRoute, profileRoute])
export const router = createRouter({ routeTree })
