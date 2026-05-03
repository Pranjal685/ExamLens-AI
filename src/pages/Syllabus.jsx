import { motion } from 'framer-motion'
import { BookOpen, UploadCloud, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'

const BRAND = 'var(--brand)'

function EmptySyllabus() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div style={{ width: 72, height: 72, borderRadius: '1.25rem', background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <BookOpen size={34} color="var(--brand)" />
        </div>
        <h1 style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-1)', marginBottom: '0.75rem' }}>Syllabus Gap Analysis</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '2rem' }}>
          Upload your official course syllabus to see which topics are covered, which are missing, and where to focus your revision.
        </p>
        <Link to="/app/upload"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--brand)', color: 'var(--brand-text)', padding: '0.8rem 1.75rem', borderRadius: 9999, fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
          <UploadCloud size={18} /> Upload Syllabus PDF
        </Link>
      </motion.div>
    </div>
  )
}

function NoSyllabusPrompt() {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
      style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:`4px solid ${BRAND}`, borderRadius:16, padding:'20px 24px', display:'flex', alignItems:'center', gap:14, marginTop:24 }}>
      <UploadCloud size={22} color={BRAND} />
      <div style={{ flex:1 }}>
        <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>Want more accurate gap analysis?</p>
        <p style={{ fontSize:'0.82rem', color:'var(--text-3)', marginTop:4 }}>Upload your syllabus PDF on the Upload page to compare against your exam papers.</p>
      </div>
      <Link to="/app/upload"
        style={{ display:'inline-flex', alignItems:'center', gap:6, background:BRAND, color:'var(--brand-text)', padding:'0.5rem 1.2rem', borderRadius:9999, fontWeight:600, textDecoration:'none', fontSize:'0.82rem', flexShrink:0 }}>
        Upload Syllabus
      </Link>
    </motion.div>
  )
}

export default function Syllabus() {
  const { analysisData, syllabusMetadata } = useAppStore()

  // No analysis at all
  if (!analysisData) {
    return (
      <PageWrapper title="Syllabus">
        <EmptySyllabus />
      </PageWrapper>
    )
  }

  const coverage = analysisData.overallCoverage || 0
  const syllabusGaps = analysisData.syllabusGaps || []
  const totalTopics = analysisData.totalTopics || (analysisData.topics || []).length
  const coveredTopics = Math.round(totalTopics * (coverage / 100))
  const uncoveredTopics = totalTopics - coveredTopics

  // Donut chart data
  const pieData = [
    { name: 'Covered', value: coverage },
    { name: 'Gaps', value: 100 - coverage },
  ]
  const PIE_COLORS = ['#ef4444', 'var(--bg-card-2)']

  return (
    <PageWrapper title="Syllabus">
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

        {/* COVERAGE OVERVIEW — grid-cols-2 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

          {/* Donut chart */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24, display:'flex', flexDirection:'column', alignItems:'center' }}>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:16, color:'var(--text-1)', alignSelf:'flex-start' }}>Overall Coverage</p>
            <div style={{ position:'relative', width:200, height:200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    animationDuration={800}
                    stroke="none"
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
                <p style={{ fontSize:32, fontWeight:800, color:'var(--text-1)', lineHeight:1 }}>{coverage}%</p>
                <p style={{ fontSize:12, color:'var(--text-3)', marginTop:4 }}>Coverage</p>
              </div>
            </div>
            
            <div style={{ display:'flex', gap:16, marginTop:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#ef4444' }} />
                <span style={{ fontSize:13, color:'var(--text-2)' }}>Topics Covered</span>
                <span style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>{coveredTopics}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--bg-card-2)' }} />
                <span style={{ fontSize:13, color:'var(--text-2)' }}>Gaps Found</span>
                <span style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>{uncoveredTopics}</span>
              </div>
            </div>
          </motion.div>

          {/* Topics comparison bar */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:20, color:'var(--text-1)' }}>Topic Coverage Breakdown</p>

            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Covered topics bar */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <CheckCircle2 size={16} color="var(--text-1)" />
                    <span style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--text-1)' }}>Topics Found in Papers</span>
                  </div>
                  <span style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--text-1)' }}>{coveredTopics}</span>
                </div>
                <div style={{ height:6, borderRadius:3, background:'var(--bg-card-2)', overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }} animate={{ width:`${coverage}%` }} transition={{ duration:1, delay:0.2 }}
                    style={{ height:'100%', borderRadius:3, background:'#ef4444' }}
                  />
                </div>
              </div>

              {/* Uncovered topics bar */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <AlertTriangle size={16} color="#f59e0b" />
                    <span style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--text-1)' }}>Syllabus Gaps</span>
                  </div>
                  <span style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--text-2)' }}>{uncoveredTopics}</span>
                </div>
                <div style={{ height:6, borderRadius:3, background:'var(--bg-card-2)', overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }} animate={{ width:`${100 - coverage}%` }} transition={{ duration:1, delay:0.3 }}
                    style={{ height:'100%', borderRadius:3, background:'#f59e0b' }}
                  />
                </div>
              </div>

              {/* Total */}
              <div style={{ borderTop:'1px solid var(--border)', paddingTop:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--text-2)' }}>Total Topics in Syllabus</span>
                  <span style={{ fontSize:'1rem', fontWeight:800, color:'var(--text-1)' }}>{totalTopics}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SYLLABUS GAPS LIST */}
        {syllabusGaps.length > 0 && (
          <div>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:16, color:'var(--text-1)' }}>
              Gap Topics ({syllabusGaps.length})
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
              {syllabusGaps.map((gap, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.06 + 0.2 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:'3px solid #f59e0b', borderRadius:8, padding:'14px 18px', display:'flex', alignItems:'center', gap:10, height:'100%' }}>
                  <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink:0 }} />
                  <p style={{ fontSize:'0.88rem', color:'var(--text-1)', fontWeight:600 }}>{gap}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* PROMPT TO UPLOAD SYLLABUS */}
        {!syllabusMetadata && <NoSyllabusPrompt />}

      </div>
    </PageWrapper>
  )
}
