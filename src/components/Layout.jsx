import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  Activity,
  LayoutDashboard,
  Siren,
  Ambulance,
  Building2,
  Map,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Bot,
  ClipboardList,
} from 'lucide-react'

export function RequireAuth({ children }) {
  const { user } = useApp()

  if (!user) {
    window.location.href = '/login'
    return null
  }

  return children
}

export default function Layout() {
  const { user, setUser, unread } = useApp()
  const navigate = useNavigate()

  const logout = () => {
    setUser(null)
    localStorage.removeItem('responsai-user')
    navigate('/login')
  }

  const links = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Report Emergency',
      path: '/report',
      icon: Siren,
    },
    {
      label: 'Emergencies',
      path: '/emergencies',
      icon: ClipboardList,
    },
    {
      label: 'Ambulances',
      path: '/ambulances',
      icon: Ambulance,
    },
    {
      label: 'Hospitals',
      path: '/hospitals',
      icon: Building2,
    },
    {
      label: 'Tracking',
      path: '/tracking',
      icon: Map,
    },
    {
      label: 'Resources',
      path: '/resources',
      icon: Activity,
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
    },
    {
      label: 'AI CallBot',
      path: '/callbot',
      icon: Bot,
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40">
        
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
              <Siren size={22} />
            </div>

            <div>
              <h1 className="font-bold text-xl">
                respons<span className="text-red-500">AI</span>
              </h1>
              <p className="text-xs text-slate-400">
                Every Second Matters
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={19} />

                <span className="text-sm font-medium">
                  {link.label}
                </span>

                {link.path === '/notifications' && unread > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.name || 'User'}
              </p>

              <p className="text-xs text-slate-400">
                {user?.role || 'Citizen'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 min-w-0">
        
        {/* Top bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Emergency Response Network
            </p>

            <p className="text-sm font-semibold text-slate-200">
              {user?.role || 'Citizen'} Portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/notifications"
              className="relative w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700"
            >
              <Bell size={18} />

              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                  {unread}
                </span>
              )}
            </NavLink>

            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <span className="text-sm">
                {user?.name || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Page */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}