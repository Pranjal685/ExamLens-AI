import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, RefreshCw, BookOpen, Calendar, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'
import { analyzePapers } from '../utils/analyzePapers'

const BRAND = 'var(--brand)'
const DAYS_FULL = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const DOT_COLOR = { HIGH:'#ef4444', MEDIUM:'#f59e0b', LOW:'#10b981', high:'#ef4444', medium:'#f59e0b', low:'#10b981' }
const EVENT_STYLE = {
  HIGH: { bg: 'rgba(239,68,68,0.08)', bgHover: 'rgba(239,68,68,0.12)', border: '#ef4444' },
  MEDIUM: { bg: 'rgba(245,158,11,0.08)', bgHover: 'rgba(245,158,11,0.12)', border: '#f59e0b' },
  LOW: { bg: 'rgba(16,185,129,0.08)', bgHover: 'rgba(16,185,129,0.12)', border: '#10b981' },
}
const TODAY = 0

function EmptyPlanner() {
  return (
    <div style={{ textAlign:'center', paddingTop:'6rem' }}>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}>
        <div style={{ width:72, height:72, borderRadius:'1.25rem', background:'rgba(14,165,233,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
          <Calendar size={34} color={BRAND} />
        </div>
        <h2 style={{ fontWeight:800, fontSize:'1.75rem', color:'var(--text-1)', marginBottom:'0.75rem' }}>No Study Plan Yet</h2>
        <p style={{ color:'var(--text-2)', fontSize:'1rem', lineHeight:1.65, marginBottom:'2rem', maxWidth:480, margin:'0 auto 2rem' }}>
          Upload your past exam papers first to generate a personalized AI-powered study plan.
        </p>
        <Link to="/app/upload"
          style={{ display:'inline-flex', alignItems:'center', gap:8, background:BRAND, color:'var(--brand-text)', padding:'0.8rem 1.75rem', borderRadius:9999, fontWeight:600, textDecoration:'none', fontSize:'0.9rem' }}>
          <BookOpen size={18} /> Upload Papers
        </Link>
      </motion.div>
    </div>
  )
}

export default function Planner() {
  const { analysisData, extractedTexts, syllabusText, setAnalysisData } = useAppStore()
  const [regenerating, setRegenerating] = useState(false)

  // No data — show empty state
  if (!analysisData || !analysisData.studyPlan) {
    return (
      <PageWrapper title="Smart Study Planner">
        <EmptyPlanner />
      </PageWrapper>
    )
  }

  const studyPlan = analysisData.studyPlan || []

  // Build daily schedule from studyPlan sessions
  const dailySchedule = DAYS_FULL.map((dayName, idx) => ({
    name: dayName,
    short: DAYS[idx].toUpperCase(),
    events: []
  }))

  studyPlan.forEach((item) => {
    (item.sessions || []).forEach(session => {
      const dayData = dailySchedule.find(d => d.name === session.day)
      if (dayData) {
        dayData.events.push({
          topic: item.topic,
          duration: session.duration || 1,
          border: EVENT_STYLE[item.priority?.toUpperCase() || 'MEDIUM']?.border || '#f59e0b'
        })
      }
    })
  })

  // Bottom stat values
  const totalHours = studyPlan.reduce((sum, t) => sum + (t.hoursPerWeek || 0), 0)
  const totalTopics = studyPlan.length

  const handleRegenerate = async () => {
    if (!extractedTexts || extractedTexts.length === 0) return
    setRegenerating(true)
    try {
      const result = await analyzePapers(extractedTexts, syllabusText)
      setAnalysisData(result)
    } catch (err) {
      console.error('Regenerate failed:', err.message)
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <PageWrapper title="Smart Study Planner">

      {/* TOP BAR */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', gap:4 }}>
            <button style={{ width:32, height:32, borderRadius:6, background:'var(--bg-card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <ChevronLeft size={16} style={{ color:'var(--text-2)' }} />
            </button>
            <button style={{ width:32, height:32, borderRadius:6, background:'var(--bg-card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <ChevronRight size={16} style={{ color:'var(--text-2)' }} />
            </button>
          </div>
          <p style={{ fontWeight:600, fontSize:16, color:'var(--text-1)' }}>Week of May 5–11, 2026</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'0.45rem 1rem', borderRadius:9999, border:'1.5px solid var(--border)', background:'transparent', color:'var(--text-2)', fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>
            <Download size={13} /> Export PDF
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'0.45rem 1rem', borderRadius:9999, background:BRAND, color:'var(--brand-text)', border:'none', fontWeight:600, fontSize:'0.82rem', cursor: regenerating ? 'not-allowed' : 'pointer', opacity: regenerating ? 0.7 : 1 }}
          >
            {regenerating ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            {regenerating ? 'Regenerating…' : 'Regenerate Plan'}
          </button>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT: KANBAN + DAILY SCHEDULE */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT SIDE: STUDY PRIORITY BOARD (55%) */}
        <div style={{ width: '55%', flexShrink: 0 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 16 }}>
            {['HIGH', 'MEDIUM', 'LOW'].map((pLevel, colIdx) => {
              const colTopics = studyPlan.filter(t => (t.priority || 'MEDIUM').toUpperCase() === pLevel)
              const dotColor = DOT_COLOR[pLevel]
              
              return (
                <div key={pLevel} style={{ display:'flex', flexDirection:'column', height: 'calc(100vh - 220px)', overflowY: 'auto', paddingRight: 4 }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, paddingBottom: 12, marginBottom: 12, borderBottom:'1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background: dotColor }} />
                    <span style={{ fontSize:12, fontWeight:700, letterSpacing:'0.05em', color:'var(--text-2)' }}>{pLevel} PRIORITY</span>
                  </div>
                  
                  <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
                    {colTopics.map((t, i) => (
                      <motion.div key={t.topic}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: colIdx * 0.1 + i * 0.05 }}
                        whileHover={{ y:-2, borderColor: 'var(--border-2)', transition: { duration: 0.15 } }}
                        style={{
                          background:'var(--bg-card)', borderRadius:12, border:'1px solid var(--border)',
                          borderLeft: `2px solid ${dotColor}`,
                          padding: '12px 16px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 12,
                          transition: 'border-color 0.15s ease'
                        }}
                      >
                        <h3 style={{ fontSize:13, fontWeight:500, color:'var(--text-1)', lineHeight:1.4, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.topic}</h3>
                        <div style={{ display:'flex', alignItems:'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', background:'var(--bg-card-2)', padding:'4px 10px', borderRadius:12 }}>
                            {t.hoursPerWeek || 0}h
                          </span>
                          <span style={{ fontSize:11, fontWeight:600, color: dotColor, border:`1px solid ${dotColor}40`, background:`${dotColor}10`, padding:'3px 8px', borderRadius:6 }}>
                            {pLevel}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {colTopics.length === 0 && (
                      <div style={{ padding: 20, textAlign:'center', border:'1px dashed var(--border)', borderRadius:12 }}>
                        <span style={{ fontSize:13, color:'var(--text-3)' }}>No topics</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT SIDE: DAILY STUDY SCHEDULE (45%) */}
        <div style={{ width: '45%', flexShrink: 0, height: 'calc(100vh - 220px)', overflowY: 'auto', paddingRight: 4 }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            {dailySchedule.map((dayObj, i) => (
              <div key={dayObj.name} style={{ display:'flex', borderBottom: i < 6 ? '1px solid var(--border)' : 'none', minHeight: 64 }}>
                {/* Left: Day Info */}
                <div style={{ 
                  width: 80, flexShrink:0, padding: 16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  borderRight: '1px solid var(--border)', background: i === TODAY ? 'rgba(245,158,11,0.04)' : 'transparent'
                }}>
                  <span style={{ fontSize:11, fontWeight:700, color: i === TODAY ? '#f59e0b' : 'var(--text-3)', letterSpacing:'0.05em' }}>{dayObj.short}</span>
                  <span style={{ fontSize:20, fontWeight:700, color: i === TODAY ? '#f59e0b' : 'var(--text-1)' }}>{5 + i}</span>
                </div>
                
                {/* Right: Chips */}
                <div style={{ flex: 1, padding: 16, display:'flex', flexWrap:'wrap', gap: 10, alignItems:'center' }}>
                  {dayObj.events.length > 0 ? (
                    dayObj.events.map((evt, idx) => (
                      <motion.div key={idx}
                        initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.2 + i * 0.05 + idx * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        style={{
                          display:'flex', alignItems:'center', gap: 8,
                          background:'var(--bg-card-2)', border:'1px solid var(--border)', borderLeft:`3px solid ${evt.border}`,
                          borderRadius: 8, padding: '8px 12px', cursor:'default'
                        }}
                      >
                        <span style={{ fontSize:13, fontWeight:600, color:'var(--text-1)', maxWidth: 220, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{evt.topic}</span>
                        <span style={{ fontSize:12, fontWeight:500, color:'var(--text-3)' }}>{evt.duration}h</span>
                      </motion.div>
                    ))
                  ) : (
                    <span style={{ fontSize:13, color:'var(--text-3)', fontStyle:'italic' }}>Rest day</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM STATS — grid-cols-3 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginTop:16, paddingBottom: 20 }}>
        {[
          { val:totalHours, label:'hours this week' },
          { val:totalTopics, label:'topics scheduled' },
          { val:'7',        label:'days planned' },
        ].map(({ val, label }, i) => (
          <motion.div key={label}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 + i * 0.08 }}
            style={{ background:'var(--bg-card-2)', borderRadius:12, padding:'20px 24px', display:'flex', alignItems:'center', gap:10 }}
          >
            <p style={{ fontSize:'36px', fontWeight:600, lineHeight:1, color:'var(--text-1)', letterSpacing:'-0.02em' }}>{val}</p>
            <p style={{ fontSize:14, fontWeight:500, color:'var(--text-3)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

    </PageWrapper>
  )
}
