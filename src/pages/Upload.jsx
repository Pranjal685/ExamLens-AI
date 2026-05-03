import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, X, Info, ArrowRight, Loader2 } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'

/* Typewriter hook */
function useTypewriter(text, speed = 40) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const run = useCallback(() => {
    setDisplayed(''); setDone(false)
    let i = 0
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) { clearInterval(t); setDone(true) }
    }, speed)
    return () => clearInterval(t)
  }, [text, speed])
  return { displayed, done, run }
}

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'History', 'Economics', 'Computer Science']

function ShimmerBlock({ h = 16 }) {
  return <div className="shimmer rounded" style={{ height: h, borderRadius: 8 }} />
}

export default function Upload() {
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef()
  const syllabusRef = useRef()

  const { papersFiles, addPaperFile, removePaperFile, updatePaperFile, syllabusFile, setSyllabusFile, clearSyllabusFile } = useAppStore()

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
    files.forEach(f => addPaperFile({ id: Date.now() + Math.random(), file: f, name: f.name, size: f.size, year: new Date().getFullYear().toString(), subject: 'Physics' }))
  }, [addPaperFile])

  const handleFileInput = (e) => {
    Array.from(e.target.files).filter(f => f.type === 'application/pdf')
      .forEach(f => addPaperFile({ id: Date.now() + Math.random(), file: f, name: f.name, size: f.size, year: new Date().getFullYear().toString(), subject: 'Physics' }))
  }

  const handleSyllabus = (e) => {
    const f = e.target.files[0]
    if (f) setSyllabusFile({ file: f, name: f.name, size: f.size })
  }

  const formatSize = (bytes) => bytes > 1e6 ? `${(bytes/1e6).toFixed(1)} MB` : `${(bytes/1e3).toFixed(0)} KB`

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => setAnalyzing(false), 4000)
  }

  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i))

  return (
    <PageWrapper title="Upload Papers">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* ── MAIN DROP ZONE ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <div
            className={`drop-zone ${dragOver ? 'over' : ''}`}
            style={{ padding: '3.5rem 2rem', minHeight: 220 }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" multiple hidden onChange={handleFileInput} />
            <div style={{ width: 60, height: 60, borderRadius: '1rem', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={30} color="#6366f1" />
            </div>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-1)' }}>Drop your PDF papers here</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>Supports PDF files up to 50MB each · Multiple files allowed</p>
            <button
              onClick={e => { e.stopPropagation(); fileInputRef.current.click() }}
              style={{ background: '#6366f1', color: '#fff', padding: '0.55rem 1.5rem', borderRadius: 9999, fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer', marginTop: '0.25rem' }}
            >Browse Files</button>
          </div>
        </motion.div>

        {/* ── UPLOADED FILES LIST ── */}
        <AnimatePresence>
          {papersFiles.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-1)' }}>Uploaded Files ({papersFiles.length})</p>
              {papersFiles.map((f) => (
                <motion.div key={f.id} layout
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={18} color="#ef4444" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{formatSize(f.size)}</p>
                  </div>
                  {/* Year tag */}
                  <select value={f.year} onChange={e => updatePaperFile(f.id, { year: e.target.value })}
                    style={{ background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 9999, padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                  {/* Subject tag */}
                  <select value={f.subject} onChange={e => updatePaperFile(f.id, { subject: e.target.value })}
                    style={{ background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: 9999, padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removePaperFile(f.id)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-card-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={13} style={{ color: 'var(--text-3)' }} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SYLLABUS SECTION ── */}
        <div style={{ marginTop: '2rem' }}>
          <div className="flex items-center gap-2 mb-3">
            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-1)' }}>Upload Syllabus</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', background: 'var(--bg-card-2)', padding: '0.15rem 0.5rem', borderRadius: 9999 }}>Optional</span>
            <Info size={14} style={{ color: 'var(--text-3)' }} title="Enables AI syllabus coverage mapping" />
          </div>

          {syllabusFile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem' }}>
              <FileText size={18} color="#6366f1" />
              <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-1)' }}>{syllabusFile.name}</span>
              <button onClick={clearSyllabusFile} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={15} style={{ color: 'var(--text-3)' }} />
              </button>
            </div>
          ) : (
            <div className="drop-zone" style={{ padding: '1.75rem', cursor: 'pointer' }}
              onClick={() => syllabusRef.current.click()}>
              <input ref={syllabusRef} type="file" accept=".pdf" hidden onChange={handleSyllabus} />
              <UploadCloud size={22} color="#6366f1" />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 500 }}>Drop your syllabus PDF here</p>
              <button onClick={e => { e.stopPropagation(); syllabusRef.current.click() }}
                style={{ background: 'transparent', border: '1.5px solid #6366f1', color: '#6366f1', padding: '0.3rem 1rem', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                Browse
              </button>
            </div>
          )}
        </div>

        {/* ── ANALYZE BUTTON ── */}
        <div style={{ marginTop: '2rem' }}>
          <motion.button
            onClick={handleAnalyze}
            disabled={papersFiles.length === 0 || analyzing}
            whileHover={papersFiles.length > 0 ? { scale: 1.01 } : {}}
            whileTap={papersFiles.length > 0 ? { scale: 0.99 } : {}}
            style={{
              width: '100%', padding: '1rem', borderRadius: 9999,
              background: papersFiles.length === 0 ? 'var(--bg-card-2)' : 'linear-gradient(135deg,#6366f1,#818cf8)',
              color: papersFiles.length === 0 ? 'var(--text-3)' : '#fff',
              border: 'none', cursor: papersFiles.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: papersFiles.length > 0 ? '0 4px 24px rgba(99,102,241,0.4)' : 'none',
            }}
          >
            {analyzing ? <><Loader2 size={18} className="animate-spin" /> Analyzing your papers…</> : <>Analyze Now <ArrowRight size={18} /></>}
          </motion.button>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.75rem' }}>
            AI will extract topics, frequency patterns, and generate your study plan
          </p>
        </div>

        {/* ── ANALYZING LOADING STATE ── */}
        <AnimatePresence>
          {analyzing && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex items-center gap-3">
                <Loader2 size={20} color="#6366f1" className="animate-spin" />
                <p style={{ fontWeight: 600, color: '#6366f1', fontSize: '0.9rem' }}>Analyzing your papers…</p>
              </div>
              {['Extracting text from PDFs…', 'Identifying topic clusters…', 'Calculating frequency scores…', 'Mapping to syllabus…'].map((step, i) => (
                <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.8 }}
                  className="flex items-center gap-3">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />
                  <ShimmerBlock h={12} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{step}</span>
                </motion.div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <ShimmerBlock h={12} />
                <ShimmerBlock h={12} />
                <ShimmerBlock h={10} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  )
}
