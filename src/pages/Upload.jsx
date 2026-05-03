import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, X, Info, ArrowRight, Loader2 } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'

const BRAND = '#0ea5e9'
const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'History', 'Economics', 'Computer Science']

function ShimmerBlock({ h = 14 }) {
  return <div className="shimmer" style={{ height:h, borderRadius:6, flex:1 }} />
}

export default function Upload() {
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef()
  const syllabusRef = useRef()

  const { papersFiles, addPaperFile, removePaperFile, updatePaperFile, syllabusFile, setSyllabusFile, clearSyllabusFile } = useAppStore()

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
      .forEach(f => addPaperFile({ id: Date.now() + Math.random(), file:f, name:f.name, size:f.size, year: String(new Date().getFullYear()), subject:'Physics' }))
  }, [addPaperFile])

  const handleFileInput = (e) => {
    Array.from(e.target.files).filter(f => f.type === 'application/pdf')
      .forEach(f => addPaperFile({ id: Date.now() + Math.random(), file:f, name:f.name, size:f.size, year: String(new Date().getFullYear()), subject:'Physics' }))
  }

  const handleSyllabus = (e) => {
    const f = e.target.files[0]
    if (f) setSyllabusFile({ file:f, name:f.name, size:f.size })
  }

  const fmt = (b) => b > 1e6 ? `${(b/1e6).toFixed(1)} MB` : `${(b/1e3).toFixed(0)} KB`

  const handleAnalyze = () => { setAnalyzing(true); setTimeout(() => setAnalyzing(false), 4000) }

  const years = Array.from({ length:10 }, (_, i) => String(new Date().getFullYear() - i))
  const canAnalyze = papersFiles.length > 0 && !analyzing

  return (
    <PageWrapper title="Upload Papers">
      <div style={{ maxWidth:860, margin:'0 auto' }}>

        {/* MAIN DROP ZONE */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <div
            className={`drop-zone${dragOver ? ' over' : ''}`}
            style={{ minHeight:280 }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" multiple hidden onChange={handleFileInput} />
            <div style={{ width:56, height:56, borderRadius:14, background:`rgba(14,165,233,0.12)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <UploadCloud size={28} color={BRAND} />
            </div>
            <p style={{ fontWeight:600, fontSize:20, color:'var(--text-1)' }}>Drop your PDF papers here</p>
            <p style={{ fontSize:14, color:'var(--text-3)', textAlign:'center' }}>Supports PDF files up to 50MB · Multiple files allowed</p>
            <button
              onClick={e => { e.stopPropagation(); fileInputRef.current.click() }}
              style={{ background:BRAND, color:'#fff', padding:'0.6rem 1.5rem', borderRadius:10, fontWeight:500, fontSize:'0.875rem', border:'none', cursor:'pointer' }}
            >Browse Files</button>
          </div>
        </motion.div>

        {/* UPLOADED FILES LIST */}
        <AnimatePresence>
          {papersFiles.length > 0 && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              style={{ marginTop:24, display:'flex', flexDirection:'column', gap:10 }}>
              <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>Uploaded Files ({papersFiles.length})</p>
              {papersFiles.map((f) => (
                <motion.div key={f.id} layout initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <FileText size={17} color="#ef4444" />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</p>
                    <p style={{ fontSize:'0.72rem', color:'var(--text-3)' }}>{fmt(f.size)}</p>
                  </div>
                  <select value={f.year} onChange={e => updatePaperFile(f.id, { year:e.target.value })}
                    style={{ background:'#fef3c7', color:'#92400e', border:'none', borderRadius:9999, padding:'0.2rem 0.55rem', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', outline:'none' }}>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                  <select value={f.subject} onChange={e => updatePaperFile(f.id, { subject:e.target.value })}
                    style={{ background:'rgba(14,165,233,0.12)', color:BRAND, border:'none', borderRadius:9999, padding:'0.2rem 0.55rem', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', outline:'none' }}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removePaperFile(f.id)} style={{ width:28, height:28, borderRadius:'50%', background:'var(--bg-card-2)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <X size={12} style={{ color:'var(--text-3)' }} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SYLLABUS SECTION */}
        <div style={{ marginTop:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>Upload Syllabus</p>
            <span style={{ fontSize:'0.72rem', color:'var(--text-3)', background:'var(--bg-card-2)', padding:'0.12rem 0.5rem', borderRadius:9999 }}>Optional</span>
            <Info size={13} style={{ color:'var(--text-3)' }} title="Enables AI syllabus gap analysis" />
          </div>
          {syllabusFile ? (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px' }}>
              <FileText size={17} color={BRAND} />
              <span style={{ flex:1, fontSize:'0.875rem', color:'var(--text-1)' }}>{syllabusFile.name}</span>
              <button onClick={clearSyllabusFile} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={14} style={{ color:'var(--text-3)' }} /></button>
            </div>
          ) : (
            <div className="drop-zone" style={{ minHeight:160, cursor:'pointer' }} onClick={() => syllabusRef.current.click()}>
              <input ref={syllabusRef} type="file" accept=".pdf" hidden onChange={handleSyllabus} />
              <UploadCloud size={22} color={BRAND} />
              <p style={{ fontSize:'0.875rem', color:'var(--text-2)', fontWeight:500 }}>Drop your syllabus PDF here</p>
              <button onClick={e => { e.stopPropagation(); syllabusRef.current.click() }}
                style={{ background:'transparent', border:`1.5px solid ${BRAND}`, color:BRAND, padding:'0.3rem 1rem', borderRadius:9999, fontSize:'0.78rem', fontWeight:600, cursor:'pointer' }}>
                Browse
              </button>
            </div>
          )}
        </div>

        {/* ANALYZE NOW BUTTON */}
        <div style={{ marginTop:28 }}>
          <motion.button
            onClick={canAnalyze ? handleAnalyze : undefined}
            whileHover={canAnalyze ? { scale:1.01 } : {}}
            whileTap={canAnalyze ? { scale:0.99 } : {}}
            style={{
              width:'100%', padding:'1.1rem', borderRadius:16,
              background: canAnalyze ? BRAND : 'var(--bg-card)',
              color: canAnalyze ? '#fff' : 'var(--text-3)',
              border:'none', cursor: canAnalyze ? 'pointer' : 'not-allowed',
              fontWeight:600, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow: canAnalyze ? `0 4px 24px rgba(14,165,233,0.35)` : 'none',
              transition:'background .2s, box-shadow .2s',
            }}
          >
            {analyzing ? <><Loader2 size={20} className="animate-spin" /> Analyzing…</> : <>Analyze Now <ArrowRight size={20} /></>}
          </motion.button>
          <p style={{ textAlign:'center', fontSize:'0.8rem', color:'var(--text-3)', marginTop:10 }}>
            AI will extract topics, frequency patterns, and generate your study plan
          </p>
        </div>

        {/* LOADING OVERLAY */}
        <AnimatePresence>
          {analyzing && (
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ marginTop:24, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24, display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Loader2 size={18} color={BRAND} className="animate-spin" />
                <p style={{ fontWeight:600, color:BRAND, fontSize:'0.9rem' }}>Analyzing your papers…</p>
              </div>
              {['Extracting text from PDFs…','Identifying topic clusters…','Calculating frequency scores…','Mapping to syllabus…'].map((step, i) => (
                <motion.div key={step} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.8 }}
                  style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:BRAND, flexShrink:0 }} />
                  <ShimmerBlock />
                  <span style={{ fontSize:'0.8rem', color:'var(--text-3)', whiteSpace:'nowrap' }}>{step}</span>
                </motion.div>
              ))}
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                <ShimmerBlock h={12} /> <ShimmerBlock h={12} /> <ShimmerBlock h={10} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  )
}
