import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  // ── Theme ──────────────────────────────────────
  darkMode: true,
  toggleDarkMode: () => {
    const next = !get().darkMode
    set({ darkMode: next })
    if (next) document.documentElement.classList.add('dark')
    else       document.documentElement.classList.remove('dark')
  },

  // ── Paper files ────────────────────────────────
  papersFiles: [],
  addPaperFile: (f) => set(s => ({ papersFiles: [...s.papersFiles, f] })),
  removePaperFile: (id) => set(s => ({ papersFiles: s.papersFiles.filter(f => f.id !== id) })),
  updatePaperFile: (id, updates) => set(s => ({
    papersFiles: s.papersFiles.map(f => f.id === id ? { ...f, ...updates } : f)
  })),

  // ── Syllabus ───────────────────────────────────
  syllabusFile: null,
  setSyllabusFile: (f) => set({ syllabusFile: f }),
  clearSyllabusFile: () => set({ syllabusFile: null }),

  // ── Analysis ───────────────────────────────────
  isAnalyzing: false,
  analysisData: null,
  analysisError: null,
  setAnalyzing: (v) => set({ isAnalyzing: v }),
  setAnalysisData: (d) => set({ analysisData: d, isAnalyzing: false }),
  setAnalysisError: (e) => set({ analysisError: e, isAnalyzing: false }),
}))

export default useAppStore
