import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Brain, Flame, FileText, Target, AlertTriangle, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'

const BRAND = '#0ea5e9'
const LEVEL_COLOR = { HIGH:'#ef4444', high:'#ef4444', MEDIUM:'#f59e0b', medium:'#f59e0b', LOW:'#10b981', low:'#10b981' }

const fadeUp = { hidden:{ opacity:0, y:20 }, show:{ opacity:1, y:0, transition:{ duration:0.4 } } }

function ShimmerBlock({ h = 20, w = '100%' }) {
  return <div className="shimmer" style={{ height:h, width:w, borderRadius:8 }} />
}

function SkeletonDashboard() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Stat card skeletons */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ background:'var(--bg-card)', borderRadius:16, padding:24, display:'flex', flexDirection:'column', gap:12, border:'1px solid var(--border)' }}>
            <ShimmerBlock h={36} w={36} />
            <ShimmerBlock h={36} w="60%" />
            <ShimmerBlock h={14} w="80%" />
          </div>
        ))}
      </div>
      {/* Chart skeletons */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {[1,2].map(i => (
          <div key={i} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
            <ShimmerBlock h={16} w="40%" />
            <div style={{ marginTop:20 }}><ShimmerBlock h={220} /></div>
          </div>
        ))}
      </div>
      {/* Topic grid skeletons */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:20 }}>
            <ShimmerBlock h={16} w="70%" />
            <div style={{ marginTop:12 }}><ShimmerBlock h={4} /></div>
            <div style={{ marginTop:12, display:'flex', gap:4 }}>
              <ShimmerBlock h={18} w={40} /> <ShimmerBlock h={18} w={40} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyDashboard() {
  return (
    <div style={{ textAlign:'center', paddingTop:'6rem' }}>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}>
        <div style={{ width:72, height:72, borderRadius:'1.25rem', background:'rgba(14,165,233,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
          <Brain size={34} color={BRAND} />
        </div>
        <h2 style={{ fontWeight:800, fontSize:'1.75rem', color:'var(--text-1)', marginBottom:'0.75rem' }}>No Analysis Yet</h2>
        <p style={{ color:'var(--text-2)', fontSize:'1rem', lineHeight:1.65, marginBottom:'2rem', maxWidth:480, margin:'0 auto 2rem' }}>
          Upload your past exam papers and run the AI analysis to see topic frequencies, trends, and importance scores here.
        </p>
        <Link to="/app/upload"
          style={{ display:'inline-flex', alignItems:'center', gap:8, background:BRAND, color:'#fff', padding:'0.8rem 1.75rem', borderRadius:9999, fontWeight:700, textDecoration:'none', fontSize:'0.9rem', boxShadow:'0 0 20px rgba(14,165,233,0.3)' }}>
          <FileText size={18} /> Upload Papers
        </Link>
      </motion.div>
    </div>
  )
}

export default function Dashboard() {
  const { analysisData, analysisComplete, isAnalyzing, uploadedFilesMetadata } = useAppStore()

  // Loading state
  if (isAnalyzing) {
    return (
      <PageWrapper title="Dashboard">
        <SkeletonDashboard />
      </PageWrapper>
    )
  }

  // No data state
  if (!analysisData) {
    return (
      <PageWrapper title="Dashboard">
        <EmptyDashboard />
      </PageWrapper>
    )
  }

  // Real data from AI
  const data = analysisData
  const topics = data.topics || []
  const topicsForChart = [...topics].sort((a, b) => b.frequency - a.frequency).slice(0, 8)
  const trendData = (data.yearWiseTrend || []).map(d => ({ year: d.year, topics: d.topicCount }))
  const sortedTopics = [...topics].sort((a, b) => b.score - a.score)
  const syllabusGaps = data.syllabusGaps || []
  const summary = data.summary || ''

  const STATS = [
    { icon:Brain,    bg:'#d1fae5', fg:'#065f46', val: String(data.totalTopics || topics.length),             label:'Topics Analyzed' },
    { icon:Flame,    bg:'#fef3c7', fg:'#92400e', val: String(data.highPriorityCount || topics.filter(t => t.priority === 'HIGH').length), label:'High Priority Topics' },
    { icon:FileText, bg:'#ede9fe', fg:'#4c1d95', val: String(uploadedFilesMetadata.length),                  label:'Papers Analyzed' },
    { icon:Target,   bg:'#ffe4e6', fg:'#881337', val: `${data.overallCoverage || 0}%`,                       label:'Syllabus Coverage' },
  ]

  return (
    <PageWrapper title="Dashboard">
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

        {/* SUMMARY CARD */}
        {summary && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:`4px solid ${BRAND}`, borderRadius:16, padding:'18px 22px', display:'flex', alignItems:'flex-start', gap:12 }}>
            <Info size={18} color={BRAND} style={{ flexShrink:0, marginTop:2 }} />
            <p style={{ fontSize:'0.9rem', color:'var(--text-2)', lineHeight:1.6 }}>{summary}</p>
          </motion.div>
        )}

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
              <BarChart data={topicsForChart.map(t => ({ topic: t.name.length > 12 ? t.name.slice(0,12) + '…' : t.name, count: t.frequency }))} margin={{ top:0, right:0, left:-20, bottom:0 }}>
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
              <LineChart data={trendData} margin={{ top:0, right:10, left:-20, bottom:0 }}>
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
            {sortedTopics.map(({ name, score, priority, years, difficulty }, i) => {
              const level = priority?.toLowerCase() || 'medium'
              return (
                <motion.div key={name}
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.06 + 0.2 }}
                  whileHover={{ y:-2, transition:{ duration:0.2 } }}
                  style={{
                    background:'var(--bg-card)', borderRadius:16, padding:20,
                    border:`1px solid var(--border)`,
                    borderLeft:`4px solid ${LEVEL_COLOR[level] || '#f59e0b'}`,
                    cursor:'default', transition:'box-shadow .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
                >
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <p style={{ fontWeight:600, fontSize:15, color:'var(--text-1)' }}>{name}</p>
                    <span className={`badge badge-${level}`}>{(priority || 'MEDIUM').toUpperCase()}</span>
                  </div>
                  {/* Progress bar — 4px height */}
                  <div style={{ height:4, borderRadius:2, background:'var(--bg-card-2)', marginBottom:12 }}>
                    <motion.div
                      initial={{ width:0 }} animate={{ width:`${score}%` }} transition={{ duration:0.8, delay: i * 0.06 + 0.3 }}
                      style={{ height:'100%', borderRadius:2, background:LEVEL_COLOR[level] || '#f59e0b' }}
                    />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', gap:4, flexWrap:'wrap', alignItems:'center' }}>
                      {(years || []).map(y => (
                        <span key={y} style={{ fontSize:'0.68rem', fontWeight:600, padding:'0.12rem 0.4rem', borderRadius:9999, background:'var(--bg-card-2)', color:'var(--text-3)' }}>{y}</span>
                      ))}
                      {difficulty && (
                        <span style={{ fontSize:'0.65rem', fontWeight:600, padding:'0.12rem 0.4rem', borderRadius:9999, background: difficulty === 'Hard' ? '#fef2f2' : difficulty === 'Medium' ? '#fef3c7' : '#d1fae5', color: difficulty === 'Hard' ? '#ef4444' : difficulty === 'Medium' ? '#f59e0b' : '#10b981' }}>
                          {difficulty}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize:14, fontWeight:600, color:'var(--text-2)' }}>{score}%</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* SYLLABUS GAPS */}
        {syllabusGaps.length > 0 && (
          <div>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:16, color:'var(--text-1)' }}>Syllabus Gaps</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {syllabusGaps.map((gap, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.06 + 0.4 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:'4px solid #f59e0b', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:10 }}>
                  <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink:0 }} />
                  <p style={{ fontSize:'0.88rem', color:'var(--text-2)' }}>{gap}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  )
}
