import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set) => ({
      // Files metadata only — File objects cannot be serialized
      uploadedFilesMetadata: [],
      syllabusMetadata: null,
      addFileMetadata: (meta) => set((s) => ({
        uploadedFilesMetadata: [...s.uploadedFilesMetadata, meta],
      })),
      removeFileMetadata: (id) => set((s) => ({
        uploadedFilesMetadata: s.uploadedFilesMetadata.filter((m) => m.id !== id),
      })),
      updateFileMetadata: (id, updates) => set((s) => ({
        uploadedFilesMetadata: s.uploadedFilesMetadata.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        ),
      })),
      setSyllabusMetadata: (meta) => set({ syllabusMetadata: meta }),
      clearSyllabusMetadata: () => set({ syllabusMetadata: null }),

      // Raw extracted texts — persist so Regenerate works without re-upload
      extractedTexts: [],
      syllabusText: '',
      setExtractedTexts: (texts) => set({ extractedTexts: texts }),
      setSyllabusText: (text) => set({ syllabusText: text }),

      // Analysis
      isAnalyzing: false,
      analysisComplete: false,
      analysisData: null,
      analysisError: null,
      analysisProgress: '',
      setIsAnalyzing: (v) => set({ isAnalyzing: v }),
      setAnalysisData: (d) => set({
        analysisData: d,
        analysisComplete: true,
        isAnalyzing: false,
        analysisError: null,
      }),
      setAnalysisError: (e) => set({ analysisError: e, isAnalyzing: false }),
      setAnalysisProgress: (msg) => set({ analysisProgress: msg }),
      clearAnalysis: () => set({
        analysisData: null,
        analysisComplete: false,
        analysisError: null,
        analysisProgress: '',
        extractedTexts: [],
        syllabusText: '',
        uploadedFilesMetadata: [],
        syllabusMetadata: null,
      }),

      // Theme
      isDark: true,
      toggleTheme: () => set((s) => {
        const next = !s.isDark
        document.documentElement.classList.toggle('dark', next)
        return { isDark: next }
      }),
    }),
    {
      name: 'examlens-storage',
      partialize: (state) => ({
        uploadedFilesMetadata: state.uploadedFilesMetadata,
        syllabusMetadata: state.syllabusMetadata,
        // extractedTexts/syllabusText kept in-memory only — sensitive raw exam content
        analysisData: state.analysisData,
        analysisComplete: state.analysisComplete,
        isDark: state.isDark,
      }),
    }
  )
)

export default useAppStore
