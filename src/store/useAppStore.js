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

  // ── Raw extracted texts (persisted for Regenerate) ──
  extractedTexts: [],
  syllabusText: '',
  setExtractedTexts: (texts) => set({ extractedTexts: texts }),
  setSyllabusText: (text) => set({ syllabusText: text }),

  // ── Analysis ───────────────────────────────────
  isAnalyzing: false,
  analysisComplete: false,
  analysisData: null,
  analysisError: null,
  analysisProgress: '',
  setAnalyzing: (v) => set({ isAnalyzing: v }),
  setAnalysisData: (d) => set({ analysisData: d, analysisComplete: true, isAnalyzing: false, analysisError: null }),
  setAnalysisError: (e) => set({ analysisError: e, isAnalyzing: false }),
  setAnalysisProgress: (msg) => set({ analysisProgress: msg }),
  clearAnalysis: () => set({ analysisData: null, analysisComplete: false, analysisError: null, analysisProgress: '' }),
}))

export default useAppStore
