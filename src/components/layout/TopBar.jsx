import { Bell, Sun, Moon } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

export default function TopBar({ title = 'Dashboard' }) {
  const { isDark, toggleTheme } = useAppStore()

  return (
    <header className="topbar">
      <h1 className="font-bold text-lg" style={{ color: 'var(--text-1)' }}>{title}</h1>

      <div className="flex items-center gap-3">
        {/* Dark / Light toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: 'var(--bg-card-2)', color: 'var(--text-2)' }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notification bell */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center relative"
          style={{ background: 'var(--bg-card-2)', color: 'var(--text-2)' }}
          title="Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
             style={{ background: 'var(--brand)' }}>
          S
        </div>
      </div>
    </header>
  )
}
