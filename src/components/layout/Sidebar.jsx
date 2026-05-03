import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, LayoutDashboard, CalendarDays, BookOpen,
  Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight,
  ScanSearch, User
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const NAV_MAIN = [
  { to: '/app/upload',    icon: Upload,          label: 'Upload Papers' },
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/planner',   icon: CalendarDays,    label: 'Study Planner' },
  { to: '/app/syllabus',  icon: BookOpen,        label: 'Syllabus' },
]
const NAV_SETTINGS = [
  { icon: Settings,   label: 'Preferences' },
  { icon: HelpCircle, label: 'Help' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const toggleDark = useAppStore(s => s.toggleDarkMode)
  const dark = useAppStore(s => s.darkMode)

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b"
           style={{ borderColor: 'var(--border)', minHeight: 64 }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
             style={{ background: '#6366f1' }}>
          <ScanSearch size={18} color="#fff" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-sm whitespace-nowrap"
              style={{ color: 'var(--text-1)' }}
            >
              ExamLens AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <div className="flex-1 px-3 py-4 flex flex-col gap-1">
        {!collapsed && (
          <p className="label-caps px-2 mb-2" style={{ color: 'var(--text-3)' }}>MAIN</p>
        )}
        {NAV_MAIN.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            title={collapsed ? label : ''}
          >
            <Icon size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        <div className="my-3 border-t" style={{ borderColor: 'var(--border)' }} />

        {!collapsed && (
          <p className="label-caps px-2 mb-2" style={{ color: 'var(--text-3)' }}>SETTINGS</p>
        )}
        {NAV_SETTINGS.map(({ icon: Icon, label }) => (
          <button key={label} className="nav-item w-full text-left" title={collapsed ? label : ''}>
            <Icon size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t px-3 py-4" style={{ borderColor: 'var(--border)' }}>
        <div className="nav-item w-full" title={collapsed ? 'Student Account' : ''}>
          <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
               style={{ background: '#6366f1' }}>
            <User size={14} color="#fff" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 min-w-0">
                <p className="text-xs font-600 truncate" style={{ color: 'var(--text-1)' }}>Student</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>Grade 12</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <LogOut size={15} style={{ color: 'var(--text-3)' }} className="flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center border"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {collapsed
          ? <ChevronRight size={12} style={{ color: 'var(--text-2)' }} />
          : <ChevronLeft size={12} style={{ color: 'var(--text-2)' }} />
        }
      </button>
    </motion.aside>
  )
}
