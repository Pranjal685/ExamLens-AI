import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ScanSearch, FileStack, Brain, BookOpen,
  Star, CalendarDays, BarChart3, ArrowRight,
  CheckCircle2, Zap, Users
} from 'lucide-react'
import useAppStore from '../store/useAppStore'
import { Sun, Moon } from 'lucide-react'

/* ── Animation helpers ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} variants={staggerContainer}
      initial="hidden" animate={inView ? 'show' : 'hidden'}
      className={className}>
      {children}
    </motion.div>
  )
}

/* ── Features data ─────────────────────────────────────── */
const FEATURES = [
  { icon: FileStack,    color: '#6366f1', label: 'Multi-PDF Upload',
    desc: 'Batch process years of past papers instantly. Handles complex scans and mixed formats.' },
  { icon: Brain,        color: '#14b8a6', label: 'AI Pattern Analysis',
    desc: 'Uncover recurring topics, question structures, and hidden trends across exam history.' },
  { icon: BookOpen,     color: '#f59e0b', label: 'Syllabus Mapping',
    desc: 'Automatically align discovered patterns with your official syllabus for full coverage.' },
  { icon: Star,         color: '#ef4444', label: 'Topic Scoring',
    desc: 'Get a clear priority index for every topic based on frequency and historical weightage.' },
  { icon: CalendarDays, color: '#10b981', label: 'Smart Study Planner',
    desc: 'AI generates a dynamic schedule that front-loads high-yield topics before exam day.' },
  { icon: BarChart3,    color: '#8b5cf6', label: 'Visual Analytics',
    desc: 'Clean charts and heatmaps make your exam landscape instantly actionable.' },
]

const STATS = [
  { icon: BarChart3, color: '#d1fae5', iconColor: '#065f46', value: '2,400+', label: 'Topics Analyzed' },
  { icon: CheckCircle2, color: '#fef3c7', iconColor: '#92400e', value: '98%',   label: 'Pattern Accuracy' },
  { icon: Zap,       color: '#ede9fe', iconColor: '#4c1d95', value: '0.8s',  label: 'AI Response' },
  { icon: Users,     color: '#ffe4e6', iconColor: '#881337', value: '18K+',  label: 'Students' },
]

const STEPS = [
  { n: '01', title: 'Upload Papers', desc: 'Drag and drop your past exam PDFs — any subject, any year.' },
  { n: '02', title: 'AI Analyzes', desc: 'Our engine extracts topics, calculates frequency, maps to syllabus.' },
  { n: '03', title: 'Get Your Plan', desc: 'Review your prioritized study roadmap and start scoring higher.' },
]

/* ─────────────────────────────────────────────────────── */
export default function Landing() {
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-1)' }}>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: 64, borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#6366f1' }}>
            <ScanSearch size={15} color="#fff" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>ExamLens AI</span>
        </div>

        {/* Nav links */}
        <div className="flex gap-8 items-center">
          {['Features', 'How It Works', 'Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              className="text-sm transition-colors"
              style={{ color: 'var(--text-2)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-2)'}
            >{l}</a>
          ))}
        </div>

        {/* Right: theme toggle + CTA */}
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--bg-card-2)', color: 'var(--text-2)' }}>
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <a href="#" className="text-sm" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>Sign In</a>
          <Link to="/app/upload"
            className="flex items-center gap-1.5 text-sm font-semibold"
            style={{
              background: 'var(--text-1)', color: '#fff',
              padding: '0.5rem 1.25rem', borderRadius: 9999,
              textDecoration: 'none', transition: 'opacity .15s',
            }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '7rem 2.5rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <motion.p variants={fadeUp} initial="hidden" animate="show"
            className="label-caps mb-4" style={{ color: '#6366f1' }}>
            AI-POWERED EXAM ANALYSIS
          </motion.p>

          {/* Word-by-word animated heading */}
          <div className="overflow-hidden">
            {['Stop Guessing.', 'Start Scoring.', 'Ace Every Exam.'].map((line, i) => (
              <motion.div key={i}
                variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: i * 0.12 + 0.1 }}
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800,
                  lineHeight: 1.05, letterSpacing: '-0.03em',
                  color: 'var(--text-1)',
                }}>
                {line}
              </motion.div>
            ))}
          </div>

          <motion.p variants={fadeUp} initial="hidden" animate="show"
            transition={{ delay: 0.45 }}
            style={{ marginTop: '1.5rem', fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--text-2)', maxWidth: 460 }}>
            Upload your past papers and let AI identify high-yield topics, predict exam patterns, and build your personalized study plan.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show"
            transition={{ delay: 0.6 }}
            className="flex gap-3 mt-8">
            <Link to="/app/upload"
              className="flex items-center gap-2 font-semibold"
              style={{
                background: 'var(--text-1)', color: '#fff',
                padding: '0.8rem 1.75rem', borderRadius: 9999,
                textDecoration: 'none', fontSize: '0.9rem',
              }}>
              Analyze My Papers <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works"
              style={{
                display: 'flex', alignItems: 'center',
                padding: '0.8rem 1.75rem', borderRadius: 9999,
                border: '1.5px solid var(--border)',
                color: 'var(--text-2)', textDecoration: 'none',
                fontSize: '0.9rem', fontWeight: 600,
              }}>
              Watch Demo
            </a>
          </motion.div>
        </div>

        {/* Floating abstract illustration */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="float"
          style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 380, height: 380, borderRadius: '2rem',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '1rem', position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Abstract decorative blobs */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(99,102,241,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(20,184,166,0.12)' }} />

            <div style={{ width: 72, height: 72, borderRadius: '1.25rem', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={38} color="#6366f1" />
            </div>
            <p className="font-bold text-center" style={{ fontSize: '1rem', color: 'var(--text-1)' }}>AI Topic Engine</p>

            {/* mini stat pills */}
            {[['Thermodynamics', '#d1fae5','#065f46'], ['Organic Chemistry','#fef3c7','#92400e'], ['Calculus','#ede9fe','#4c1d95']].map(([t, bg, col]) => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap: 8, background: bg, padding: '0.35rem 1rem', borderRadius: 9999 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: col }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: col }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section id="features" style={{ background: darkMode ? '#080b12' : '#010816', padding: '3.5rem 2.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
          {STATS.map(({ icon: Icon, color, iconColor, value, label }) => (
            <Section key={label}>
              <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={iconColor} />
                </div>
                <div>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>{label}</p>
                </div>
              </motion.div>
            </Section>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '7rem 2.5rem' }}>
        <Section>
          <motion.p variants={fadeUp} className="label-caps text-center mb-3" style={{ color: '#6366f1' }}>FEATURES</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: '3.5rem' }}>
            Everything You Need to Score Higher
          </motion.h2>
        </Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {FEATURES.map(({ icon: Icon, color, label, desc }) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '1.25rem', padding: '1.75rem',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-1)' }}>{label}</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-2)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: 'var(--bg-card-2)', padding: '7rem 2.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Section>
            <motion.p variants={fadeUp} className="label-caps text-center mb-3" style={{ color: '#6366f1' }}>PROCESS</motion.p>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: '4rem' }}>
              3 Simple Steps
            </motion.h2>
          </Section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', position: 'relative' }}>
            {/* Dashed connector line */}
            <div style={{ position: 'absolute', top: 28, left: '16.5%', right: '16.5%', height: 1, borderTop: '2px dashed var(--border)' }} />
            {STEPS.map(({ n, title, desc }) => (
              <Section key={n}>
                <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', margin: '0 auto 1.25rem',
                    background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1rem', color: '#fff',
                  }}>{n}</div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-1)' }}>{title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
                </motion.div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ───────────────────────────────────────── */}
      <section style={{ background: darkMode ? '#080b12' : '#010816', padding: '7rem 2.5rem', textAlign: 'center' }}>
        <Section>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
            Ready to Transform Your Study Sessions?
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Join 18,000+ students who score higher with AI-guided preparation.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/app/upload"
              className="flex items-center gap-2 mx-auto"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#6366f1', color: '#fff',
                padding: '0.9rem 2.25rem', borderRadius: 9999,
                fontWeight: 700, textDecoration: 'none', fontSize: '1rem',
                boxShadow: '0 0 32px rgba(99,102,241,0.4)',
              }}>
              Start Analyzing for Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </Section>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#6366f1' }}>
            <ScanSearch size={13} color="#fff" />
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>ExamLens AI</span>
          <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginLeft: 8 }}>© 2026</span>
        </div>
        <div className="flex gap-6">
          {['Terms of Service', 'Privacy Policy', 'Contact Support'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--text-3)', fontSize: '0.8rem', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
