import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, RefreshCw, Clock, BookOpen, Calendar } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'

const BRAND = '#0ea5e9'

const TOPICS = [
  { name:'Thermodynamics',    level:'high',   hours:8, done:65 },
  { name:'Organic Chemistry', level:'high',   hours:6, done:45 },
  { name:'Calculus',          level:'medium', hours:5, done:30 },
  { name:'Genetics',          level:'medium', hours:4, done:20 },
  { name:'Vectors',           level:'low',    hours:3, done:60 },
  { name:'Cell Biology',      level:'low',    hours:2, done:10 },
]
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const HOURS = ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM']
const EVENTS = [
  { day:0, start:0, span:2, topic:'Thermodynamics', cls:'cal-coral' },
  { day:1, start:1, span:2, topic:'Calculus',        cls:'cal-amber' },
  { day:2, start:5, span:2, topic:'Thermodynamics', cls:'cal-coral' },
  { day:3, start:6, span:2, topic:'Calculus',        cls:'cal-amber' },
  { day:4, start:0, span:1, topic:'Vectors',         cls:'cal-green' },
  { day:5, start:2, span:3, topic:'Review Session',  cls:'cal-indigo' },
  { day:6, start:1, span:2, topic:'Genetics',        cls:'cal-amber' },
]
const DOT_COLOR = { high:'#ef4444', medium:'#f59e0b', low:'#10b981' }
const TODAY = 0

export default function Planner() {
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
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'0.45rem 1rem', borderRadius:9999, background:BRAND, color:'#fff', border:'none', fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>
            <RefreshCw size={13} /> Regenerate Plan
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
          {TOPICS.map(({ name, level, hours, done }, i) => (
            <motion.div key={name}
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.06 + 0.1 }}
              style={{ minHeight:48, display:'flex', flexDirection:'column', justifyContent:'center', paddingBottom:10, borderBottom: i < TOPICS.length-1 ? '1px solid var(--border)' : 'none', marginBottom: i < TOPICS.length-1 ? 10 : 0 }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:DOT_COLOR[level], flexShrink:0 }} />
                  <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-1)' }}>{name}</span>
                </div>
                <span style={{ fontSize:'0.75rem', color:'var(--text-3)', fontWeight:500 }}>{hours}h</span>
              </div>
              <div style={{ height:5, borderRadius:3, background:'var(--bg-card-2)' }}>
                <motion.div
                  initial={{ width:0 }} animate={{ width:`${done}%` }} transition={{ duration:0.7, delay: i * 0.06 + 0.2 }}
                  style={{ height:'100%', borderRadius:3, background:DOT_COLOR[level] }}
                />
              </div>
            </motion.div>
          ))}
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
                  const evt = EVENTS.find(e => e.day === di && e.start === hi)
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
          { icon:Clock,    val:'28 hours', label:'Total Study Time',   bg:'#ede9fe', fg:'#4c1d95' },
          { icon:BookOpen, val:'6 topics', label:'Topics Covered',     bg:'#d1fae5', fg:'#065f46' },
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
