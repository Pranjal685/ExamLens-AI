import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, X, Info, ArrowRight, Loader2, AlertCircle, Trash2, RefreshCw } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'
import { extractTextFromPDF } from '../utils/pdfToText'
import { analyzePapers } from '../utils/analyzePapers'

const BRAND = 'var(--brand)'
const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'History', 'Economics', 'Computer Science']

function ShimmerBlock({ h = 14 }) {
  return <div className="shimmer" style={{ height:h, borderRadius:6, flex:1 }} />
}

export default function Upload() {
  const [dragOver, setDragOver] = useState(false)
  const [progressMsg, setProgressMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [clearMsg, setClearMsg] = useState('')
  // Local state holds actual File objects — not serializable, session-only
  const [localFiles, setLocalFiles] = useState([])
  const [localSyllabus, setLocalSyllabus] = useState(null)
  const fileInputRef = useRef()
  const syllabusRef = useRef()
  const navigate = useNavigate()

  const {
    uploadedFilesMetadata,
    syllabusMetadata,
    addFileMetadata,
    removeFileMetadata,
    updateFileMetadata,
    setSyllabusMetadata,
    clearSyllabusMetadata,
    isAnalyzing,
    setIsAnalyzing,
    setAnalysisData,
    setAnalysisError,
    setExtractedTexts,
    setSyllabusText,
    setAnalysisProgress,
    clearAnalysis,
    extractedTexts,
  } = useAppStore()

  // On mount: if metadata exists but no local files, show session notice (handled by staleSession derived state)
  const staleSession = uploadedFilesMetadata.length > 0 && localFiles.length === 0

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf').forEach(addFile)
  }, [])

  const handleFileInput = (e) => {
    Array.from(e.target.files).filter(f => f.type === 'application/pdf').forEach(addFile)
  }

  function addFile(f) {
    const id = Date.now() + Math.random()
    const meta = { id, name: f.name, size: f.size, year: String(new Date().getFullYear()), subject: 'Physics' }
    setLocalFiles(prev => [...prev, { ...meta, file: f }])
    addFileMetadata(meta)
  }

  function removeFile(id) {
    setLocalFiles(prev => prev.filter(f => f.id !== id))
    removeFileMetadata(id)
  }

  function updateFile(id, updates) {
    setLocalFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
    updateFileMetadata(id, updates)
  }

  const handleSyllabus = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setLocalSyllabus({ file: f, name: f.name, size: f.size })
    setSyllabusMetadata({ name: f.name, size: f.size })
  }

  function removeSyllabus() {
    setLocalSyllabus(null)
    clearSyllabusMetadata()
  }

  const fmt = (b) => b > 1e6 ? `${(b/1e6).toFixed(1)} MB` : `${(b/1e3).toFixed(0)} KB`

  const handleClearAll = () => {
    clearAnalysis()
    setLocalFiles([])
    setLocalSyllabus(null)
    setErrorMsg('')
    setProgressMsg('')
    setClearMsg('All data cleared')
    setTimeout(() => setClearMsg(''), 3000)
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setErrorMsg('')
    setProgressMsg('Starting analysis…')
    setAnalysisProgress('Starting analysis…')

    try {
      // Process ALL PDFs in parallel
      const msg = `Extracting text from ${localFiles.length} paper${localFiles.length > 1 ? 's' : ''} simultaneously…`
      setProgressMsg(msg)
      setAnalysisProgress(msg)

      const extractionPromises = localFiles.map(async (f) => {
        const text = await extractTextFromPDF(f.file)
        return { text, name: f.name, year: f.year, subject: f.subject }
      })

      const extractedTexts = await Promise.all(extractionPromises)
      setExtractedTexts(extractedTexts)

      let syllabusTextContent = ''
      if (localSyllabus) {
        setProgressMsg('Extracting syllabus text…')
        setAnalysisProgress('Extracting syllabus text…')
        syllabusTextContent = await extractTextFromPDF(localSyllabus.file)
        setSyllabusText(syllabusTextContent)
      }

      setProgressMsg('Running AI analysis on extracted content…')
      setAnalysisProgress('Running AI analysis on extracted content…')
      const result = await analyzePapers(extractedTexts, syllabusTextContent)

      setProgressMsg('Building your study plan…')
      setAnalysisProgress('Building your study plan…')

      setAnalysisData(result)
      setProgressMsg('')
      navigate('/app/dashboard')

    } catch (err) {
      console.error('Analysis error:', err)
      setIsAnalyzing(false)
      setAnalysisError(err.message)
      setErrorMsg(err.message || 'Something went wrong during analysis. Please try again.')
      setProgressMsg('')
    }
  }

  const years = Array.from({ length:10 }, (_, i) => String(new Date().getFullYear() - i))
  const hasPreviousAnalysis = staleSession && extractedTexts && extractedTexts.length > 0;
  const canAnalyze = (localFiles.length > 0 && !isAnalyzing) || hasPreviousAnalysis;

  const handleAction = () => {
    if (hasPreviousAnalysis && localFiles.length === 0) {
      navigate('/app/dashboard');
    } else if (canAnalyze) {
      handleAnalyze();
    }
  }

  // Display list: local files if available, else persisted metadata (read-only)
  const displayFiles = localFiles.length > 0 ? localFiles : uploadedFilesMetadata

  return (
    <PageWrapper title="Upload Papers">
      <div style={{ maxWidth:860, margin:'0 auto' }}>

        {/* PAGE HEADER with Clear button */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {clearMsg && (
              <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ fontSize:'0.78rem', color:'#10b981', fontWeight:600 }}>
                {clearMsg}
              </motion.span>
            )}
          </div>
          <button
            onClick={handleClearAll}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'0.4rem 1rem', borderRadius:9999, border:'1.5px solid var(--border)', background:'transparent', color:'var(--text-3)', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}
          >
            <Trash2 size={13} /> Clear All Data
          </button>
        </div>

        {/* SESSION NOTICE — previous session files, no File objects available */}
        <AnimatePresence>
          {staleSession && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ marginBottom:16, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
              <RefreshCw size={15} color="var(--text-2)" style={{ flexShrink:0 }} />
              <p style={{ fontSize:'0.82rem', color:'var(--text-1)', flex:1 }}>
                Previous session files shown — re-upload to re-analyze
              </p>
              <button onClick={handleClearAll} style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>
                <X size={14} color="var(--text-2)" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
            <div style={{ width:56, height:56, borderRadius:12, background:'var(--bg-card-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <UploadCloud size={24} color="var(--text-1)" />
            </div>
            <p style={{ fontWeight:600, fontSize:20, color:'var(--text-1)' }}>Drop your PDF papers here</p>
            <p style={{ fontSize:14, color:'var(--text-3)', textAlign:'center' }}>Supports PDF files up to 50MB · Multiple files allowed</p>
            <button
              onClick={e => { e.stopPropagation(); fileInputRef.current.click() }}
              style={{ background:BRAND, color:'var(--brand-text)', padding:'0.6rem 1.5rem', borderRadius:8, fontWeight:600, fontSize:'0.875rem', border:'none', cursor:'pointer' }}
            >Browse Files</button>
          </div>
        </motion.div>

        {/* UPLOADED FILES LIST */}
        <AnimatePresence>
          {displayFiles.length > 0 && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              style={{ marginTop:24, display:'flex', flexDirection:'column', gap:10 }}>
              <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>
                {localFiles.length > 0 ? `Uploaded Files (${localFiles.length})` : `Uploaded Papers (${uploadedFilesMetadata.length})`}
              </p>
              {displayFiles.map((f) => (
                <motion.div key={f.id} layout initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, opacity: staleSession ? 0.7 : 1 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:'var(--bg-card-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <FileText size={17} color="var(--text-1)" />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</p>
                    <p style={{ fontSize:'0.72rem', color:'var(--text-3)' }}>{fmt(f.size)}</p>
                  </div>
                  {!staleSession && (
                    <>
                      <select value={f.year} onChange={e => updateFile(f.id, { year:e.target.value })}
                        style={{ background:'var(--bg-card-2)', color:'var(--text-1)', border:'1px solid var(--border)', borderRadius:4, padding:'0.2rem 0.55rem', fontSize:'0.72rem', fontWeight:500, cursor:'pointer', outline:'none' }}>
                        {years.map(y => <option key={y}>{y}</option>)}
                      </select>
                      <select value={f.subject} onChange={e => updateFile(f.id, { subject:e.target.value })}
                        style={{ background:'var(--bg-card-2)', color:'var(--text-1)', border:'1px solid var(--border)', borderRadius:4, padding:'0.2rem 0.55rem', fontSize:'0.72rem', fontWeight:500, cursor:'pointer', outline:'none' }}>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => removeFile(f.id)} style={{ width:28, height:28, borderRadius:'50%', background:'var(--bg-card-2)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <X size={12} style={{ color:'var(--text-3)' }} />
                      </button>
                    </>
                  )}
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
          {(localSyllabus || syllabusMetadata) ? (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 16px' }}>
              <FileText size={17} color="var(--text-1)" />
              <span style={{ flex:1, fontSize:'0.875rem', color:'var(--text-1)' }}>{(localSyllabus || syllabusMetadata).name}</span>
              {!staleSession && (
                <button onClick={removeSyllabus} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={14} style={{ color:'var(--text-3)' }} /></button>
              )}
            </div>
          ) : (
            <div className="drop-zone" style={{ minHeight:160, cursor:'pointer' }} onClick={() => syllabusRef.current.click()}>
              <input ref={syllabusRef} type="file" accept=".pdf" hidden onChange={handleSyllabus} />
              <UploadCloud size={20} color="var(--text-2)" />
              <p style={{ fontSize:'0.875rem', color:'var(--text-2)', fontWeight:500 }}>Drop your syllabus PDF here</p>
              <button onClick={e => { e.stopPropagation(); syllabusRef.current.click() }}
                style={{ background:'var(--bg-card-2)', border:`1px solid var(--border)`, color:'var(--text-1)', padding:'0.3rem 1rem', borderRadius:6, fontSize:'0.78rem', fontWeight:600, cursor:'pointer' }}>
                Browse
              </button>
            </div>
          )}
        </div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ marginTop:16, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'flex-start', gap:10 }}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink:0, marginTop:2 }} />
              <div>
                <p style={{ fontWeight:600, fontSize:'0.85rem', color:'#991b1b' }}>Analysis Failed</p>
                <p style={{ fontSize:'0.78rem', color:'#b91c1c', marginTop:2 }}>{errorMsg}</p>
              </div>
              <button onClick={() => setErrorMsg('')} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer' }}>
                <X size={14} color="#ef4444" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ANALYZE NOW BUTTON */}
        <div style={{ marginTop:28 }}>
          <motion.button
            onClick={canAnalyze ? handleAction : undefined}
            whileHover={canAnalyze ? { scale:1.01 } : {}}
            whileTap={canAnalyze ? { scale:0.99 } : {}}
            style={{
              width:'100%', padding:'1rem', borderRadius:8,
              background: canAnalyze ? BRAND : 'var(--bg-card-2)',
              color: canAnalyze ? 'var(--brand-text)' : 'var(--text-3)',
              border: canAnalyze ? 'none' : '1px solid var(--border)', cursor: canAnalyze ? 'pointer' : 'not-allowed',
              fontWeight:600, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow: 'none',
              transition:'background .2s',
            }}
          >
            {isAnalyzing ? <><Loader2 size={20} className="animate-spin" /> Analyzing…</> : 
              (hasPreviousAnalysis && localFiles.length === 0) ? <>View Previous Analysis <ArrowRight size={20} /></> :
              <>Analyze Now <ArrowRight size={20} /></>}
          </motion.button>
          <p style={{ textAlign:'center', fontSize:'0.8rem', color:'var(--text-3)', marginTop:10 }}>
            AI will extract topics, frequency patterns, and generate your study plan
          </p>
        </div>

        {/* LOADING OVERLAY */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ marginTop:24, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24, display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Loader2 size={18} color={BRAND} className="animate-spin" />
                <p style={{ fontWeight:600, color:BRAND, fontSize:'0.9rem' }}>{progressMsg || 'Analyzing your papers…'}</p>
              </div>
              {['Extracting text from PDFs…','Identifying topic clusters…','Calculating frequency scores…','Mapping to syllabus…'].map((step, i) => (
                <motion.div key={step} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.8 }}
                  style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:BRAND, flexShrink:0 }} />
                  <span style={{ fontSize:'0.85rem', color:'var(--text-1)', whiteSpace:'nowrap', width:180 }}>{step}</span>
                  <ShimmerBlock />
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
