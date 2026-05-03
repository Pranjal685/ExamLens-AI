import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ScanSearch, FileStack, Brain, BookOpen, Star, CalendarDays, BarChart3, ArrowRight, CheckCircle2, Zap, Users, Sun, Moon } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const fadeUp = { hidden: { opacity:0, y:28 }, show: { opacity:1, y:0, transition: { duration:0.5, ease:'easeOut' } } }
const blurReveal = { hidden: { opacity: 0, y: 15, filter: 'blur(10px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } } }
const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.1 } } }

function Reveal({ children, className='' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-60px' })
  return <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>{children}</motion.div>
}

const BRAND = 'var(--brand)'

const FEATURES = [
  { icon: FileStack,    label: 'Multi-PDF Upload',      desc: 'Batch process years of past papers instantly. Handles complex scans and mixed formats.' },
  { icon: Brain,        label: 'AI Pattern Analysis',   desc: 'Uncover recurring topics, question structures, and hidden trends across exam history.' },
  { icon: BookOpen,     label: 'Syllabus Mapping',      desc: 'Automatically align discovered patterns with your official syllabus for full coverage.' },
  { icon: Star,         label: 'Topic Scoring',         desc: 'Get a clear priority index for every topic based on frequency and historical weightage.' },
  { icon: CalendarDays, label: 'Smart Study Planner',   desc: 'AI generates a dynamic schedule that front-loads high-yield topics before exam day.' },
  { icon: BarChart3,    label: 'Visual Analytics',      desc: 'Clean charts and heatmaps make your exam landscape instantly actionable.' },
]

const STATS = [
  { icon: BarChart3,    value:'2,400+', label:'Topics Analyzed' },
  { icon: CheckCircle2, value:'98%',    label:'Pattern Accuracy' },
  { icon: Zap,          value:'0.8s',   label:'AI Response' },
  { icon: Users,        value:'18K+',   label:'Students' },
]

const STEPS = [
  { n:'01', title:'Upload Papers',     desc:'Drag and drop your past exam PDFs — any subject, any year.' },
  { n:'02', title:'AI Analyzes',       desc:'Our engine extracts topics, calculates frequency, maps to syllabus.' },
  { n:'03', title:'Get Your Plan',     desc:'Review your prioritized study roadmap and start scoring higher.' },
]

export default function Landing() {
  const { isDark, toggleTheme } = useAppStore()
  const dark = isDark

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div style={{ background:'var(--landing-gradient, var(--bg))', color:'var(--text-1)', minHeight:'100vh' }}>

      {/* NAVBAR */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2.5rem', height:64, borderBottom:'1px solid var(--border)', background:'var(--bg-card)', position:'sticky', top:0, zIndex:50 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <div style={{ width:28, height:28, borderRadius:7, background:BRAND, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ScanSearch size={14} color="var(--brand-text)" />
          </div>
          <span style={{ fontWeight:700, fontSize:'0.875rem', color:'var(--text-1)' }}>ExamLens AI</span>
        </Link>

        <div style={{ display:'flex', gap:32, alignItems:'center' }}>
          {['Features','How It Works','Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`}
              style={{ fontSize:'0.875rem', color:'var(--text-2)', textDecoration:'none', transition:'color .15s' }}
              onMouseEnter={e => e.target.style.color='var(--text-1)'}
              onMouseLeave={e => e.target.style.color='var(--text-2)'}
            >{l}</a>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={toggleTheme} style={{ width:34, height:34, borderRadius:8, border:'none', background:'var(--bg-card-2)', color:'var(--text-2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <a href="#" style={{ fontSize:'0.875rem', color:'var(--text-2)', textDecoration:'none' }}>Sign In</a>
          <Link to="/app/upload" style={{ background:BRAND, color:'var(--brand-text)', padding:'0.45rem 1.25rem', borderRadius:9999, fontWeight:600, fontSize:'0.85rem', textDecoration:'none' }}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth:1280, margin:'0 auto', padding:'0 2.5rem', minHeight:'85vh', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>
        <div>
          <motion.p variants={fadeUp} initial="hidden" animate="show"
            style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:BRAND, marginBottom:20 }}>
            AI-POWERED EXAM ANALYSIS
          </motion.p>

          <div>
            {['Stop Guessing.','Start Scoring.','Ace Every Exam.'].map((line, i) => (
              <motion.div key={i} variants={blurReveal} initial="hidden" animate="show" transition={{ delay: i * 0.12 + 0.1 }}
                style={{ fontSize:'clamp(40px,6vw,72px)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.03em', color:'var(--text-1)' }}>
                {line}
              </motion.div>
            ))}
          </div>

          <motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ delay:0.5 }}
            style={{ marginTop:24, fontSize:'1.05rem', lineHeight:1.65, color:'var(--text-2)', maxWidth:460 }}>
            Upload your past papers and let AI identify high-yield topics, predict exam patterns, and build your personalized study plan.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay:0.65 }} style={{ display:'flex', gap:12, marginTop:36 }}>
            <Link to="/app/upload" style={{ display:'flex', alignItems:'center', gap:8, background:BRAND, color:'var(--brand-text)', padding:'0.75rem 1.75rem', borderRadius:9999, fontWeight:700, textDecoration:'none', fontSize:'0.9rem' }}>
              Analyze My Papers <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" style={{ display:'flex', alignItems:'center', padding:'0.75rem 1.75rem', borderRadius:9999, border:'1.5px solid var(--border)', color:'var(--text-2)', textDecoration:'none', fontSize:'0.9rem', fontWeight:600 }}>
              Watch Demo
            </a>
          </motion.div>
        </div>

        {/* Hero card — AI Topic Engine */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.3 }} style={{ display:'flex', justifyContent:'center' }}>
          <div style={{ width:360, borderRadius:20, background:'var(--bg-card)', border:'1px solid var(--border)', padding:28, display:'flex', flexDirection:'column', alignItems:'center', gap:12, position:'relative', overflow:'hidden' }}>
            <div style={{ width:64, height:64, borderRadius:16, background:'var(--bg-card-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Brain size={34} color="var(--text-1)" />
            </div>
            <p style={{ fontWeight:600, fontSize:'0.95rem', color:'var(--text-1)' }}>AI Topic Engine</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10, width:'100%', marginTop:8 }}>
              {['Thermodynamics', 'Organic Chemistry', 'Calculus'].map((t) => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:12, background:'var(--bg-card-2)', border:'1px solid var(--border)', padding:'0.6rem 1rem', borderRadius:8 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-3)' }} />
                  <span style={{ fontSize:'0.85rem', fontWeight:500, color:'var(--text-2)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section id="features" style={{ background: 'var(--bg-card)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'3.5rem 2.5rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
          {STATS.map(({ icon: Icon, value, label }, idx) => (
            <Reveal key={label}>
              <motion.div variants={fadeUp} style={{
                display:'flex', alignItems:'center', gap:16, justifyContent:'center', padding:'0 2rem',
                borderRight: idx < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ width:48, height:48, borderRadius:10, background:'var(--bg-card-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={22} color="var(--text-1)" />
                </div>
                <div>
                  <p style={{ fontSize:'1.75rem', fontWeight:700, color:'var(--text-1)', lineHeight:1 }}>{value}</p>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-3)', marginTop:5 }}>{label}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ maxWidth:1280, margin:'0 auto', padding:'5rem 2.5rem' }}>
        <Reveal>
          <motion.p variants={fadeUp} style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:BRAND, textAlign:'center', marginBottom:12 }}>FEATURES</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:800, textAlign:'center', letterSpacing:'-0.02em', color:'var(--text-1)', marginBottom:'3rem' }}>
            Everything You Need to Score Higher
          </motion.h2>
        </Reveal>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <motion.div key={label} whileHover={{ y:-2 }} transition={{ duration:0.2 }}
              className="hover-feature-card"
              style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, padding:28, display:'flex', flexDirection:'column', height:'100%' }}>
              <div style={{ width:44, height:44, borderRadius:10, background:'var(--bg-card-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={20} color="var(--text-1)" />
              </div>
              <h3 style={{ fontWeight:600, fontSize:'0.95rem', marginBottom:8, color:'var(--text-1)' }}>{label}</h3>
              <p style={{ fontSize:'0.875rem', lineHeight:1.6, color:'var(--text-2)', flex:1 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background:'var(--bg-card-2)', padding:'5rem 2.5rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <Reveal>
            <motion.p variants={fadeUp} style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:BRAND, textAlign:'center', marginBottom:12 }}>PROCESS</motion.p>
            <motion.h2 variants={fadeUp} style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:800, textAlign:'center', letterSpacing:'-0.02em', color:'var(--text-1)', marginBottom:'3.5rem' }}>3 Simple Steps</motion.h2>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32, position:'relative' }}>
            <div style={{ position:'absolute', top:27, left:'17%', right:'17%', height:1, borderTop:'2px dashed var(--border)' }} />
            {STEPS.map(({ n, title, desc }) => (
              <Reveal key={n}>
                <motion.div variants={fadeUp} style={{ textAlign:'center' }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', margin:'0 auto 20px', background:'var(--bg-card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>{n}</div>
                  <h3 style={{ fontWeight:700, marginBottom:8, color:'var(--text-1)' }}>{title}</h3>
                  <p style={{ fontSize:'0.875rem', color:'var(--text-2)', lineHeight:1.6 }}>{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-card-2)', borderTop:'1px solid var(--border)', padding:'5rem 2.5rem', textAlign:'center' }}>
        <Reveal>
          <motion.h2 variants={fadeUp} style={{ fontSize:'clamp(1.75rem,4vw,3rem)', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.02em', marginBottom:20 }}>
            Ready to Transform Your Study Sessions?
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color:'var(--text-2)', fontSize:'1rem', marginBottom:36 }}>
            Join 18,000+ students who score higher with AI-guided preparation.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/app/upload" style={{ display:'inline-flex', alignItems:'center', gap:8, background:BRAND, color:'var(--brand-text)', padding:'0.9rem 2.25rem', borderRadius:9999, fontWeight:600, textDecoration:'none', fontSize:'1rem' }}>
              Start Analyzing for Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'1.75rem 2.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
            <div style={{ width:22, height:22, borderRadius:6, background:BRAND, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ScanSearch size={12} color="var(--brand-text)" />
            </div>
            <span style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-1)' }}>ExamLens AI</span>
          </Link>
          <span style={{ color:'var(--text-3)', fontSize:'0.8rem', marginLeft:8 }}>© 2026</span>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {['Terms of Service','Privacy Policy','Contact'].map(l => (
            <a key={l} href="#" style={{ color:'var(--text-3)', fontSize:'0.8rem', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
