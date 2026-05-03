import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts'
import { Brain, Flame, FileText, Target } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'

/* ── Sample data ─────────────────────────────────────────── */
const FREQ_DATA = [
  { topic: 'Thermodynamics', count: 47 }, { topic: 'Organic Chem', count: 38 },
  { topic: 'Calculus', count: 34 }, { topic: 'Genetics', count: 29 },
  { topic: 'Vectors', count: 25 }, { topic: 'Electrochemistry', count: 21 },
]
const TREND_DATA = [
  { year: '2019', topics: 18 }, { year: '2020', topics: 22 },
  { year: '2021', topics: 19 }, { year: '2022', topics: 31 },
  { year: '2023', topics: 28 }, { year: '2024', topics: 35 },
]
const TOPIC_CARDS = [
  { name: 'Thermodynamics', score: 92, level: 'high',   years: ['2022','2023','2024'] },
  { name: 'Organic Chemistry', score: 88, level: 'high', years: ['2021','2023','2024'] },
  { name: 'Calculus', score: 74, level: 'high',         years: ['2022','2023'] },
  { name: 'Genetics', score: 61, level: 'medium',       years: ['2022','2024'] },
  { name: 'Vectors', score: 55, level: 'medium',        years: ['2023','2024'] },
  { name: 'Electrochemistry', score: 42, level: 'low',  years: ['2024'] },
]
const HEATMAP = Array.from({ length: 8 }, (_, row) =>
  Array.from({ length: 12 }, (_, col) => Math.floor(Math.random() * 5))
)
const HEATMAP_TOPICS = ['Mechanics','Thermodynamics','Electromagnetism','Optics','Modern Physics','Organic Chem','Inorganic','PhysicalChem','Calculus','Algebra','Trigonometry','Statistics','Genetics','Evolution','Ecology','Cell Bio','Vectors','Matrices']

const STATS = [
  { icon: Brain,    bg: 'stat-mint',     val: '2,847', label: 'Topics Analyzed' },
  { icon: Flame,    bg: 'stat-yellow',   val: '127',   label: 'High Priority Topics' },
  { icon: FileText, bg: 'stat-lavender', val: '18',    label: 'Papers Analyzed' },
  { icon: Target,   bg: 'stat-peach',    val: '89%',   label: 'Syllabus Coverage' },
]

function ShimmerBlock({ h = 16 }) {
  return <div className="shimmer rounded" style={{ height: h, borderRadius: 8 }} />
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function Dashboard() {
  return (
    <PageWrapper title="Dashboard">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── STAT CARDS ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {STATS.map(({ icon: Icon, bg, val, label }, i) => (
            <motion.div key={label}
              className={`stat-card ${bg}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
            >
              <Icon size={22} />
              <div>
                <p style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, marginTop: 4, opacity: 0.8 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CHARTS ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Bar Chart */}
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-1)' }}>Topic Frequency</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={FREQ_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="topic" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Line Chart */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-1)' }}>Year-Wise Trend</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TREND_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="topics" stroke="#14b8a6" strokeWidth={2.5}
                  dot={{ fill: '#14b8a6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ── TOPIC IMPORTANCE CARDS ──────────────────────────── */}
        <div>
          <p style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-1)' }}>Topic Importance Grid</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.875rem' }}>
            {TOPIC_CARDS.map(({ name, score, level, years }, i) => (
              <motion.div key={name}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.2 }}
                whileHover={{ y: -2 }}
                style={{
                  background: 'var(--bg-card)', borderRadius: '1rem', padding: '1.1rem 1.25rem',
                  border: '1px solid var(--border)',
                  borderLeft: `4px solid ${level === 'high' ? '#ef4444' : level === 'medium' ? '#f59e0b' : '#10b981'}`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-1)' }}>{name}</p>
                  <span className={`badge badge-${level}`}>{level.toUpperCase()}</span>
                </div>
                {/* Frequency bar */}
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-card-2)', marginBottom: '0.75rem' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, delay: i * 0.06 + 0.3 }}
                    style={{ height: '100%', borderRadius: 3, background: level === 'high' ? '#ef4444' : level === 'medium' ? '#f59e0b' : '#10b981' }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {years.map(y => (
                      <span key={y} style={{ fontSize: '0.68rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: 9999, background: 'var(--bg-card-2)', color: 'var(--text-3)' }}>{y}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-2)' }}>{score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── HEATMAP ──────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontWeight: 700, color: 'var(--text-1)' }}>Syllabus Coverage Heatmap</p>
            <div className="flex items-center gap-2">
              {[['Not Covered','heat-0'],['Low','heat-1'],['Medium','heat-2'],['High','heat-3'],['Full','heat-4']].map(([l,cls]) => (
                <div key={l} className="flex items-center gap-1">
                  <div className={`heatmap-cell ${cls}`} style={{ width: 12, height: 12, borderRadius: 2 }} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {HEATMAP.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: '0.35rem' }}>
                {row.map((val, ci) => (
                  <motion.div key={ci}
                    className={`heatmap-cell heat-${val}`}
                    style={{ width: 28, height: 28, borderRadius: 4 }}
                    whileHover={{ scale: 1.25, zIndex: 1 }}
                    title={HEATMAP_TOPICS[ri * 2 + (ci % 4)] || 'Topic'}
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
