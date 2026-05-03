import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, RefreshCw, Clock, BookOpen, Calendar } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'

const TOPICS = [
  { name: 'Thermodynamics',   level: 'high',   hours: 8, done: 65 },
  { name: 'Organic Chemistry',level: 'high',   hours: 6, done: 45 },
  { name: 'Calculus',         level: 'medium', hours: 5, done: 30 },
  { name: 'Genetics',         level: 'medium', hours: 4, done: 20 },
  { name: 'Vectors',          level: 'low',    hours: 3, done: 60 },
  { name: 'Cell Biology',     level: 'low',    hours: 2, done: 10 },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM']

const EVENTS = [
  { day: 0, start: 0, span: 2, topic: 'Thermodynamics', cls: 'cal-coral' },
  { day: 1, start: 1, span: 2, topic: 'Calculus',        cls: 'cal-amber' },
  { day: 2, start: 5, span: 2, topic: 'Thermodynamics', cls: 'cal-coral' },
  { day: 3, start: 6, span: 2, topic: 'Calculus',        cls: 'cal-amber' },
  { day: 4, start: 0, span: 1, topic: 'Vectors',         cls: 'cal-green' },
  { day: 5, start: 2, span: 3, topic: 'Review Session',  cls: 'cal-indigo' },
  { day: 6, start: 1, span: 2, topic: 'Genetics',        cls: 'cal-amber' },
]

const dotColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' }
const levelBg   = { high: 'stat-peach', medium: 'stat-yellow', low: 'stat-mint' }

export default function Planner() {
  const today = 0 // Monday highlighted

  return (
    <PageWrapper title="Smart Study Planner">
      {/* ── TOP ACTIONS ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={15} style={{ color: 'var(--text-2)' }} />
          </button>
          <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.95rem' }}>Week of May 5–11, 2026</p>
          <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronRight size={15} style={{ color: 'var(--text-2)' }} />
          </button>
        </div>
        <div className="flex gap-2">
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1.1rem', borderRadius: 9999, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
            <Download size={14} /> Export PDF
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1.1rem', borderRadius: 9999, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
            <RefreshCw size={14} /> Regenerate Plan
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.25rem', alignItems: 'start' }}>

        {/* ── LEFT: TOPIC LIST ─────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)', marginBottom: '0.75rem' }}>Topic Allocation</p>
            {/* Legend */}
            <div className="flex gap-2 flex-wrap mb-3">
              {[['HIGH','#f87171','#ef4444'], ['MEDIUM','#fbbf24','#f59e0b'], ['LOW','#34d399','#10b981']].map(([l,tc,bg]) => (
                <span key={l} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 9999, background: bg + '20', color: tc, letterSpacing: '0.04em' }}>{l}</span>
              ))}
            </div>
          </div>

          {TOPICS.map(({ name, level, hours, done }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 + 0.1 }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor[level], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-1)' }}>{name}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>{hours}h</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-card-2)' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${done}%` }}
                  transition={{ duration: 0.7, delay: i * 0.06 + 0.2 }}
                  style={{ height: '100%', borderRadius: 3, background: dotColor[level] }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── RIGHT: WEEKLY CALENDAR ───────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1.25rem', overflow: 'hidden' }}>
          <p style={{ fontWeight: 700, padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', color: 'var(--text-1)', fontSize: '0.9rem' }}>Weekly Schedule</p>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(7,1fr)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '0.5rem' }} />
            {DAYS.map((d, i) => (
              <div key={d} style={{
                textAlign: 'center', padding: '0.625rem 0.25rem',
                borderLeft: '1px solid var(--border)',
                background: i === today ? 'rgba(99,102,241,0.1)' : 'transparent',
              }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: i === today ? '#6366f1' : 'var(--text-3)', textTransform: 'uppercase' }}>{d}</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, color: i === today ? '#6366f1' : 'var(--text-2)' }}>
                  {5 + i}
                </p>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div style={{ overflowY: 'auto', maxHeight: 460 }}>
            {HOURS.map((hr, hi) => (
              <div key={hr} style={{ display: 'grid', gridTemplateColumns: '52px repeat(7,1fr)', borderBottom: '1px solid var(--border)', minHeight: 48 }}>
                <div style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{hr}</span>
                </div>
                {DAYS.map((_, di) => {
                  const evt = EVENTS.find(e => e.day === di && e.start === hi)
                  return (
                    <div key={di} style={{
                      borderLeft: '1px solid var(--border)', padding: '0.2rem',
                      background: di === today ? 'rgba(99,102,241,0.04)' : 'transparent',
                      position: 'relative', minHeight: 48,
                    }}>
                      {evt && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + di * 0.05 }}
                          className={`cal-block ${evt.cls}`}
                          style={{
                            position: 'absolute', left: 4, right: 4, top: 2,
                            height: evt.span * 48 - 4, minHeight: 36,
                            borderRadius: 6, padding: '0.25rem 0.4rem',
                            fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden',
                            zIndex: 1,
                          }}
                        >
                          {evt.topic}
                          <br />
                          <span style={{ opacity: 0.75, fontSize: '0.62rem' }}>{evt.span}h</span>
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

      {/* ── BOTTOM STATS ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '1.25rem' }}>
        {[
          { icon: Clock,    val: '28 hours', label: 'Total Study Time This Week', cls: 'stat-lavender' },
          { icon: BookOpen, val: '6 topics', label: 'Topics Covered',             cls: 'stat-mint' },
          { icon: Calendar, val: '15 days',  label: 'Until Estimated Exam',        cls: 'stat-peach' },
        ].map(({ icon: Icon, val, label, cls }, i) => (
          <motion.div key={label}
            className={`stat-card ${cls}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}
          >
            <Icon size={22} />
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{val}</p>
              <p style={{ fontSize: '0.78rem', fontWeight: 500, marginTop: 3, opacity: 0.8 }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  )
}
