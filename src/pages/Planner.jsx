import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, RefreshCw, Clock, BookOpen, Calendar, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'
import { analyzePapers } from '../utils/analyzePapers'

const BRAND = '#0ea5e9'
const DAYS_FULL = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const HOURS = ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM']
const HOUR_MAP = { '09:00':0, '10:00':1, '11:00':2, '12:00':3, '13:00':4, '14:00':5, '15:00':6, '16:00':7, '17:00':8, '18:00':9, '19:00':10, '20:00':11 }
const DOT_COLOR = { HIGH:'#ef4444', MEDIUM:'#f59e0b', LOW:'#10b981', high:'#ef4444', medium:'#f59e0b', low:'#10b981' }
const CLS_MAP = { HIGH:'cal-coral', MEDIUM:'cal-amber', LOW:'cal-green', high:'cal-coral', medium:'cal-amber', low:'cal-green' }
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
          style={{ display:'inline-flex', alignItems:'center', gap:8, background:BRAND, color:'#fff', padding:'0.8rem 1.75rem', borderRadius:9999, fontWeight:700, textDecoration:'none', fontSize:'0.9rem', boxShadow:'0 0 20px rgba(14,165,233,0.3)' }}>
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

  // Build calendar events from studyPlan sessions
  const events = []
  studyPlan.forEach((item, planIdx) => {
    (item.sessions || []).forEach(session => {
      const dayIdx = DAYS_FULL.indexOf(session.day)
      const hourIdx = HOUR_MAP[session.startTime]
      if (dayIdx >= 0 && hourIdx !== undefined) {
        events.push({
          day: dayIdx,
          start: hourIdx,
          span: session.duration || 1,
          topic: item.topic,
          cls: CLS_MAP[item.priority] || 'cal-amber',
          color: item.color,
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
      console.error('Regenerate error:', err)
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <PageWrapper title="Smart Study Planner">

      {/* TOP BAR */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button style={{ width:32, height:32, borderRadius:'50%', background:'var(--bg-card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <ChevronLeft size={14} style={{ color:'var(--text-2)' }} />
          </button>
          <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>Week of May 5–11, 2026</p>
          <button style={{ width:32, height:32, borderRadius:'50%', background:'var(--bg-card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <ChevronRight size={14} style={{ color:'var(--text-2)' }} />
          </button>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'0.45rem 1rem', borderRadius:9999, border:'1.5px solid var(--border)', background:'transparent', color:'var(--text-2)', fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>
            <Download size={13} /> Export PDF
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'0.45rem 1rem', borderRadius:9999, background:BRAND, color:'#fff', border:'none', fontWeight:600, fontSize:'0.82rem', cursor: regenerating ? 'not-allowed' : 'pointer', opacity: regenerating ? 0.7 : 1 }}
          >
            {regenerating ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            {regenerating ? 'Regenerating…' : 'Regenerate Plan'}
          </button>
        </div>
      </div>

      {/* MAIN GRID: left panel + calendar */}
      <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>

        {/* LEFT: TOPIC ALLOCATION — w-72 */}
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}
          style={{ width:288, flexShrink:0, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:20, display:'flex', flexDirection:'column', gap:0 }}>

          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>Topic Allocation</p>
            <div style={{ display:'flex', gap:4 }}>
              {[['H','#f87171','#ef4444'],['M','#fbbf24','#f59e0b'],['L','#34d399','#10b981']].map(([l,tc,bg]) => (
                <span key={l} style={{ fontSize:'0.62rem', fontWeight:700, padding:'0.15rem 0.4rem', borderRadius:9999, background:bg+'20', color:tc }}>
                  {l === 'H' ? 'HIGH' : l === 'M' ? 'MED' : 'LOW'}
                </span>
              ))}
            </div>
          </div>

          {/* Topic rows — consistent 48px height */}
          {studyPlan.map(({ topic, priority, hoursPerWeek }, i) => {
            const level = priority?.toLowerCase() || 'medium'
            // Progress bar proportional to hours (max ~10h)
            const pct = Math.min(100, ((hoursPerWeek || 0) / 10) * 100)
            return (
              <motion.div key={topic}
                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.06 + 0.1 }}
                style={{ minHeight:48, display:'flex', flexDirection:'column', justifyContent:'center', paddingBottom:10, borderBottom: i < studyPlan.length-1 ? '1px solid var(--border)' : 'none', marginBottom: i < studyPlan.length-1 ? 10 : 0 }}
              >
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:DOT_COLOR[level] || '#f59e0b', flexShrink:0 }} />
                    <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-1)' }}>{topic}</span>
                  </div>
                  <span style={{ fontSize:'0.75rem', color:'var(--text-3)', fontWeight:500 }}>{hoursPerWeek}h</span>
                </div>
                <div style={{ height:5, borderRadius:3, background:'var(--bg-card-2)' }}>
                  <motion.div
                    initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7, delay: i * 0.06 + 0.2 }}
                    style={{ height:'100%', borderRadius:3, background:DOT_COLOR[level] || '#f59e0b' }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* RIGHT: WEEKLY SCHEDULE — flex-1 */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
          style={{ flex:1, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>

          {/* Calendar title + week nav */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
            <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>Weekly Schedule</p>
          </div>

          {/* Day headers — 8-col grid (60px time + 7 days) */}
          <div style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', borderBottom:'1px solid var(--border)' }}>
            <div style={{ padding:'0.5rem' }} />
            {DAYS.map((d, i) => (
              <div key={d} style={{
                textAlign:'center', padding:'10px 4px',
                borderLeft:'1px solid var(--border)',
                background: i === TODAY ? `rgba(14,165,233,0.08)` : 'transparent',
              }}>
                <p style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color: i === TODAY ? BRAND : 'var(--text-3)', letterSpacing:'0.06em' }}>{d}</p>
                <p style={{ fontSize:'0.85rem', fontWeight:600, color: i === TODAY ? BRAND : 'var(--text-1)', marginTop:2 }}>{5 + i}</p>
              </div>
            ))}
          </div>

          {/* Time rows — 60px height */}
          <div style={{ overflowY:'auto', maxHeight:440 }}>
            {HOURS.map((hr, hi) => (
              <div key={hr} style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', borderBottom:'1px solid var(--border)', minHeight:60 }}>
                <div style={{ padding:'0 8px', display:'flex', alignItems:'center', borderRight:'1px solid var(--border)' }}>
                  <span style={{ fontSize:'0.66rem', color:'var(--text-3)', whiteSpace:'nowrap' }}>{hr}</span>
                </div>
                {DAYS.map((_, di) => {
                  const evt = events.find(e => e.day === di && e.start === hi)
                  return (
                    <div key={di} style={{
                      borderLeft:'1px solid var(--border)', position:'relative', minHeight:60, padding:2,
                      background: di === TODAY ? 'rgba(14,165,233,0.03)' : 'transparent',
                    }}>
                      {evt && (
                        <motion.div
                          initial={{ opacity:0, scale:0.9 }}
                          animate={{ opacity:1, scale:1 }}
                          transition={{ delay:0.3 + di * 0.05 }}
                          className={`cal-block ${evt.cls}`}
                          style={{ position:'absolute', left:3, right:3, top:3, height: evt.span * 60 - 6, borderRadius:8, padding:'8px 8px', fontSize:13, fontWeight:600, zIndex:1, overflow:'hidden' }}
                        >
                          {evt.topic}
                          <br />
                          <span style={{ fontSize:12, opacity:0.75 }}>{evt.span}h</span>
                        </motion.div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* BOTTOM STATS — grid-cols-3 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginTop:16 }}>
        {[
          { icon:Clock,    val:`${totalHours} hours`, label:'Total Study Time',   bg:'#ede9fe', fg:'#4c1d95' },
          { icon:BookOpen, val:`${totalTopics} topics`, label:'Topics Covered',     bg:'#d1fae5', fg:'#065f46' },
          { icon:Calendar, val:'15 days',  label:'Until Estimated Exam', bg:'#ffe4e6', fg:'#881337' },
        ].map(({ icon: Icon, val, label, bg, fg }, i) => (
          <motion.div key={label}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 + i * 0.08 }}
            whileHover={{ y:-3, transition:{ duration:0.15 } }}
            style={{ background:bg, borderRadius:16, padding:'20px 24px', display:'flex', alignItems:'center', gap:16 }}
          >
            <div style={{ width:36, height:36, borderRadius:10, background:fg+'28', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={18} color={fg} />
            </div>
            <div>
              <p style={{ fontSize:'1.5rem', fontWeight:800, lineHeight:1, color:fg }}>{val}</p>
              <p style={{ fontSize:'0.78rem', fontWeight:500, marginTop:3, color:fg, opacity:0.75 }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </PageWrapper>
  )
}
