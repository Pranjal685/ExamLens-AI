import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, LayoutDashboard, CalendarDays, BookOpen,
  Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight,
  ScanSearch, User,
} from 'lucide-react'

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

const lbl = {
  show: { opacity: 1, transition: { duration: 0.15, delay: 0.12 } },
  hide: { opacity: 0, transition: { duration: 0.12 } },
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.22, ease: 'easeInOut', delay: collapsed ? 0.14 : 0 }}
      className="sidebar"
    >
      {/* LOGO */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding: collapsed ? '0 20px' : '0 16px', height:64, borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:8, flexShrink:0, background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <ScanSearch size={17} color="#fff" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span key="bn" variants={lbl} initial="hide" animate="show" exit="hide"
              style={{ fontWeight:700, fontSize:'0.875rem', color:'var(--text-1)', whiteSpace:'nowrap' }}>
              ExamLens AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* MAIN NAV */}
      <div style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        {!collapsed && <p style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-3)', padding:'0 8px', margin:'4px 0' }}>MAIN</p>}

        {NAV_MAIN.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} title={collapsed ? label : ''} style={{ textDecoration:'none' }}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon size={18} style={{ flexShrink:0 }} />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span key={`n${label}`} variants={lbl} initial="hide" animate="show" exit="hide"
                  style={{ whiteSpace:'nowrap' }}>{label}</motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        <div style={{ height:1, background:'var(--border)', margin:'10px 0' }} />

        {!collapsed && <p style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-3)', padding:'0 8px', marginBottom:4 }}>SETTINGS</p>}

        {NAV_SETTINGS.map(({ icon: Icon, label }) => (
          <button key={label} title={collapsed ? label : ''} className="nav-item">
            <Icon size={18} style={{ flexShrink:0 }} />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span key={`s${label}`} variants={lbl} initial="hide" animate="show" exit="hide"
                  style={{ whiteSpace:'nowrap' }}>{label}</motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* USER PROFILE — pinned bottom */}
      <div style={{ borderTop:'1px solid var(--border)', padding:'12px 10px', flexShrink:0 }}>
        <div className="nav-item" style={{ cursor:'default' }} title={collapsed ? 'Student' : ''}>
          <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <User size={13} color="#fff" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div key="ui" variants={lbl} initial="hide" animate="show" exit="hide" style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-1)', lineHeight:1.2 }}>Student</p>
                <p style={{ fontSize:'0.72rem', color:'var(--text-3)' }}>Grade 12</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && <LogOut size={14} style={{ color:'var(--text-3)', flexShrink:0 }} />}
        </div>
      </div>

      {/* COLLAPSE TOGGLE */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{ position:'absolute', right:-12, top:80, width:24, height:24, borderRadius:'50%', background:'var(--bg-card)', border:'1px solid var(--border)', boxShadow:'0 2px 8px rgba(0,0,0,.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={12} style={{ color:'var(--text-2)' }} /> : <ChevronLeft size={12} style={{ color:'var(--text-2)' }} />}
      </button>
    </motion.aside>
  )
}
