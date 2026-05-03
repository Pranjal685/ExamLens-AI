import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import Planner from './pages/Planner'
import Syllabus from './pages/Syllabus'
import useAppStore from './store/useAppStore'

export default function App() {
  const darkMode = useAppStore(s => s.darkMode)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app/upload" element={<Upload />} />
      <Route path="/app/dashboard" element={<Dashboard />} />
      <Route path="/app/planner" element={<Planner />} />
      <Route path="/app/syllabus" element={<Syllabus />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
