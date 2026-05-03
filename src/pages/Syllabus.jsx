import { motion } from 'framer-motion'
import { BookOpen, Upload, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'

export default function Syllabus() {
  return (
    <PageWrapper title="Syllabus">
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div style={{ width: 72, height: 72, borderRadius: '1.25rem', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <BookOpen size={34} color="#6366f1" />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-1)', marginBottom: '0.75rem' }}>Syllabus Gap Analysis</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '2rem' }}>
            Upload your official course syllabus to see which topics are covered, which are missing, and where to focus your revision.
          </p>
          <Link to="/app/upload"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6366f1', color: '#fff', padding: '0.8rem 1.75rem', borderRadius: 9999, fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
            <UploadCloud size={18} /> Upload Syllabus PDF
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
