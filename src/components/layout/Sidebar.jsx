import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, LayoutDashboard, CalendarDays, BookOpen,
  Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight,
  ScanSearch, User, X, ChevronDown
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

const lbl = {
  show: { opacity: 1, transition: { duration: 0.15, delay: 0.12 } },
  hide: { opacity: 0, transition: { duration: 0.12 } },
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [helpExpanded, setHelpExpanded] = useState({})
  const { isDark, toggleTheme, clearAnalysis } = useAppStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAnalysis()
    setActiveModal(null)
    navigate('/')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.22, ease: 'easeInOut', delay: collapsed ? 0.14 : 0 }}
      className="sidebar"
    >
      {/* LOGO */}
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:12, padding: collapsed ? '0 20px' : '0 16px', height:64, borderBottom:'1px solid var(--border)', flexShrink:0, textDecoration:'none' }}>
        <div style={{ width:32, height:32, borderRadius:8, flexShrink:0, background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <ScanSearch size={17} color="var(--brand-text)" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span key="bn" variants={lbl} initial="hide" animate="show" exit="hide"
              style={{ fontWeight:700, fontSize:'0.875rem', color:'var(--text-1)', whiteSpace:'nowrap' }}>
              ExamLens AI
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

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
          <button key={label} title={collapsed ? label : ''} className="nav-item" onClick={() => setActiveModal(label)}>
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
            <User size={13} color="var(--brand-text)" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div key="ui" variants={lbl} initial="hide" animate="show" exit="hide" style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-1)', lineHeight:1.2 }}>Student</p>
                <p style={{ fontSize:'0.72rem', color:'var(--text-3)' }}>Grade 12</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={() => setActiveModal('Logout')} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
              <LogOut size={14} style={{ color:'var(--text-3)', flexShrink:0 }} />
            </button>
          )}
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
      <AnimatePresence>
        {activeModal && (
          <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setActiveModal(null)}
              style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} />
            
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }} transition={{ duration:0.2, ease:'easeOut' }}
              style={{ position:'relative', zIndex:1000, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:20, width:'100%', maxWidth:400, overflow:'hidden', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
              
              {activeModal === 'Preferences' && (
                <div style={{ padding:24 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                    <h3 style={{ fontWeight:700, fontSize:18, color:'var(--text-1)' }}>Preferences</h3>
                    <button onClick={() => setActiveModal(null)} style={{ background:'transparent', border:'none', cursor:'pointer' }}><X size={18} color="var(--text-2)" /></button>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:14, fontWeight:600, color:'var(--text-1)' }}>Dark Mode</span>
                      <button onClick={toggleTheme} style={{ width:40, height:24, borderRadius:12, background:isDark ? 'var(--brand)' : 'var(--bg-card-2)', border:'1px solid var(--border)', position:'relative', cursor:'pointer', transition:'0.2s' }}>
                        <div style={{ position:'absolute', top:2, left:isDark ? 18 : 2, width:18, height:18, borderRadius:'50%', background:isDark ? 'var(--brand-text)' : 'var(--text-2)', transition:'0.2s' }} />
                      </button>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:14, fontWeight:600, color:'var(--text-1)' }}>Notifications</span>
                      <button style={{ width:40, height:24, borderRadius:12, background:'var(--brand)', border:'1px solid var(--border)', position:'relative', cursor:'pointer', transition:'0.2s' }}>
                        <div style={{ position:'absolute', top:2, left:18, width:18, height:18, borderRadius:'50%', background:'var(--brand-text)', transition:'0.2s' }} />
                      </button>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:14, fontWeight:600, color:'var(--text-1)' }}>Compact View</span>
                      <button style={{ width:40, height:24, borderRadius:12, background:'var(--bg-card-2)', border:'1px solid var(--border)', position:'relative', cursor:'pointer', transition:'0.2s' }}>
                        <div style={{ position:'absolute', top:2, left:2, width:18, height:18, borderRadius:'50%', background:'var(--text-2)', transition:'0.2s' }} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'Help' && (
                <div style={{ padding:24 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                    <h3 style={{ fontWeight:700, fontSize:18, color:'var(--text-1)' }}>Need Help?</h3>
                    <button onClick={() => setActiveModal(null)} style={{ background:'transparent', border:'none', cursor:'pointer' }}><X size={18} color="var(--text-2)" /></button>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {[
                      { q:'How to upload papers', a:'Simply drag and drop multiple PDF files into the dropzone on the Upload page.' },
                      { q:'How analysis works', a:'Our AI engine extracts text, identifies key concepts, and calculates historical frequency to score topics.' },
                      { q:'How to read your study plan', a:'High priority topics (red) are scheduled first. Follow the daily hours to optimize your coverage.' }
                    ].map((item, i) => (
                      <div key={i} style={{ border:'1px solid var(--border)', borderRadius:8, padding:12, background:'var(--bg-card)' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }} onClick={() => setHelpExpanded(prev => ({...prev, [i]: !prev[i]}))}>
                          <span style={{ fontSize:13, fontWeight:600, color:'var(--text-1)' }}>{item.q}</span>
                          <ChevronDown size={14} style={{ color:'var(--text-2)', transform: helpExpanded[i] ? 'rotate(180deg)' : 'none', transition:'0.2s' }} />
                        </div>
                        <AnimatePresence>
                          {helpExpanded[i] && (
                            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} style={{ overflow:'hidden' }}>
                              <div style={{ fontSize:12, color:'var(--text-3)', marginTop:8 }}>{item.a}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'Logout' && (
                <div style={{ padding:24, textAlign:'center' }}>
                  <h3 style={{ fontWeight:700, fontSize:18, color:'var(--text-1)', marginBottom:12 }}>Are you sure you want to logout?</h3>
                  <p style={{ fontSize:14, color:'var(--text-3)', marginBottom:24 }}>This will clear your current session data.</p>
                  <div style={{ display:'flex', gap:12 }}>
                    <button onClick={() => setActiveModal(null)} style={{ flex:1, padding:'10px', borderRadius:8, background:'transparent', border:'1px solid var(--border)', color:'var(--text-1)', fontWeight:600, cursor:'pointer' }}>Cancel</button>
                    <button onClick={handleLogout} style={{ flex:1, padding:'10px', borderRadius:8, background:'#ef4444', border:'none', color:'#fff', fontWeight:600, cursor:'pointer' }}>Logout</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
