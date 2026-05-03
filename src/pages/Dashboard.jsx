import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Brain, Flame, FileText, Target } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'

const BRAND = '#0ea5e9'

const FREQ_DATA = [
  { topic:'Thermo', count:47 }, { topic:'OrganChem', count:38 },
  { topic:'Calculus', count:34 }, { topic:'Genetics', count:29 },
  { topic:'Vectors', count:25 }, { topic:'ElectroChem', count:21 },
]
const TREND_DATA = [
  { year:'2019', topics:18 }, { year:'2020', topics:22 },
  { year:'2021', topics:19 }, { year:'2022', topics:31 },
  { year:'2023', topics:28 }, { year:'2024', topics:35 },
]
const TOPIC_CARDS = [
  { name:'Thermodynamics',   score:92, level:'high',   years:['2022','2023','2024'] },
  { name:'Organic Chemistry',score:88, level:'high',   years:['2021','2023','2024'] },
  { name:'Calculus',         score:74, level:'high',   years:['2022','2023'] },
  { name:'Genetics',         score:61, level:'medium', years:['2022','2024'] },
  { name:'Vectors',          score:55, level:'medium', years:['2023','2024'] },
  { name:'Electrochemistry', score:42, level:'low',    years:['2024'] },
]
const HEATMAP = Array.from({ length:8 }, () => Array.from({ length:12 }, () => Math.floor(Math.random() * 5)))
const HM_LABELS = ['Mechanics','Thermodynamics','Electromag','Optics','Modern Physics','Organic','Inorganic','Physical','Calculus','Algebra','Trigonometry','Statistics','Genetics','Evolution','Ecology','Cell Bio','Vectors','Matrices']

const STATS = [
  { icon:Brain,    bg:'#d1fae5', fg:'#065f46', val:'2,847', label:'Topics Analyzed' },
  { icon:Flame,    bg:'#fef3c7', fg:'#92400e', val:'127',   label:'High Priority Topics' },
  { icon:FileText, bg:'#ede9fe', fg:'#4c1d95', val:'18',    label:'Papers Analyzed' },
  { icon:Target,   bg:'#ffe4e6', fg:'#881337', val:'89%',   label:'Syllabus Coverage' },
]

const LEVEL_COLOR = { high:'#ef4444', medium:'#f59e0b', low:'#10b981' }

const fadeUp = { hidden:{ opacity:0, y:20 }, show:{ opacity:1, y:0, transition:{ duration:0.4 } } }

export default function Dashboard() {
  return (
    <PageWrapper title="Dashboard">
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

        {/* STAT CARDS — grid-cols-4 */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {STATS.map(({ icon: Icon, bg, fg, val, label }, i) => (
            <motion.div key={label}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y:-3, transition:{ duration:0.15 } }}
              style={{ background:bg, borderRadius:16, padding:'24px', display:'flex', flexDirection:'column', gap:12, height:'100%' }}
            >
              {/* Icon with tinted bg */}
              <div style={{ width:36, height:36, borderRadius:10, background: fg + '28', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={20} color={fg} />
              </div>
              <div>
                <p style={{ fontSize:36, fontWeight:700, lineHeight:1, color:fg }}>{val}</p>
                <p style={{ fontSize:14, color:fg, opacity:0.7, marginTop:4 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CHARTS — grid-cols-2 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:20, color:'var(--text-1)' }}>Topic Frequency</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={FREQ_DATA} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="topic" tick={{ fontSize:10, fill:'var(--text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:'var(--text-3)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }} cursor={{ fill:'rgba(14,165,233,0.06)' }} />
                <Bar dataKey="count" fill={BRAND} radius={[4,4,0,0]} animationDuration={800} animationBegin={0} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay:0.1 }}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:20, color:'var(--text-1)' }}>Year-Wise Trend</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TREND_DATA} margin={{ top:0, right:10, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize:10, fill:'var(--text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:'var(--text-3)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }} />
                <Line type="monotone" dataKey="topics" stroke="#10b981" strokeWidth={2.5} dot={{ fill:'#10b981', r:4 }} activeDot={{ r:6 }} animationDuration={800} animationBegin={0} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* TOPIC IMPORTANCE GRID */}
        <div>
          <p style={{ fontWeight:600, fontSize:16, marginBottom:16, color:'var(--text-1)' }}>Topic Importance Grid</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {TOPIC_CARDS.map(({ name, score, level, years }, i) => (
              <motion.div key={name}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.06 + 0.2 }}
                whileHover={{ y:-2, transition:{ duration:0.2 } }}
                style={{
                  background:'var(--bg-card)', borderRadius:16, padding:20,
                  border:`1px solid var(--border)`,
                  borderLeft:`4px solid ${LEVEL_COLOR[level]}`,
                  cursor:'default', transition:'box-shadow .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.2)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
              >
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <p style={{ fontWeight:600, fontSize:15, color:'var(--text-1)' }}>{name}</p>
                  <span className={`badge badge-${level}`}>{level.toUpperCase()}</span>
                </div>
                {/* Progress bar — 4px height */}
                <div style={{ height:4, borderRadius:2, background:'var(--bg-card-2)', marginBottom:12 }}>
                  <motion.div
                    initial={{ width:0 }} animate={{ width:`${score}%` }} transition={{ duration:0.8, delay: i * 0.06 + 0.3 }}
                    style={{ height:'100%', borderRadius:2, background:LEVEL_COLOR[level] }}
                  />
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                    {years.map(y => (
                      <span key={y} style={{ fontSize:'0.68rem', fontWeight:600, padding:'0.12rem 0.4rem', borderRadius:9999, background:'var(--bg-card-2)', color:'var(--text-3)' }}>{y}</span>
                    ))}
                  </div>
                  <span style={{ fontSize:14, fontWeight:600, color:'var(--text-2)' }}>{score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* HEATMAP */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <p style={{ fontWeight:600, fontSize:16, color:'var(--text-1)' }}>Syllabus Coverage Heatmap</p>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {[['Not Covered','heat-0'],['Low','heat-1'],['Medium','heat-2'],['High','heat-3'],['Full','heat-4']].map(([l,cls]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <div className={`heatmap-cell ${cls}`} style={{ width:12, height:12, borderRadius:2 }} />
                  <span style={{ fontSize:'0.65rem', color:'var(--text-3)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            {HEATMAP.map((row, ri) => (
              <div key={ri} style={{ display:'flex', gap:5 }}>
                {row.map((val, ci) => (
                  <motion.div key={ci} className={`heatmap-cell heat-${val}`}
                    style={{ width:28, height:28, borderRadius:4 }}
                    whileHover={{ scale:1.25 }}
                    title={HM_LABELS[ri * 2 + (ci % 4)] || 'Topic'}
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </PageWrapper>
  )
}
