# ExamLens AI — Hackathon Project Context

## Project Overview
AI-powered past paper analyzer that maps topic frequency against syllabus, ranks high-yield topics, and generates smart study planners.

**Hackathon:** AI DecodeX by UnsaidTalks  
**Deadline:** 3rd May 2026, 6:00 PM  
**Submission:** Public GitHub repo + Unstop portal

---

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **AI:** Gemini API (paid tier)
- **Models:** `gemini-1.5-flash` via Google AI Studio — both vision/image PDFs and text analysis
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **UI Generation:** Stitch MCP

---

## File Structure
```
src/
  components/
    ui/           ← shadcn components
    layout/       ← Sidebar, Navbar, PageWrapper
    charts/       ← TopicFrequencyChart, HeatmapChart, TrendChart
    upload/       ← DropZone, FileCard, UploadProgress
    planner/      ← StudyPlanCard, WeeklySchedule
    analysis/     ← TopicCard, ScoreBadge, PatternCard
  pages/
    Landing.jsx   ← Hero, Features, CTA (animated)
    Upload.jsx    ← Multi-file upload page
    Dashboard.jsx ← Analytics + topic scores
    Planner.jsx   ← Smart study planner output
    Syllabus.jsx  ← Syllabus upload + gap analysis
  utils/
    callAI.js     ← Single OpenRouter fetch utility
    pdfToImages.js ← pdf.js page → canvas → base64
    parseAnalysis.js ← Structure raw AI response
  hooks/
    useFileUpload.js
    useAnalysis.js
  store/
    useAppStore.js ← Zustand global state
  App.jsx
  main.jsx
```

---

## Design System

### Style References (from Dribbble screenshots shared)
1. **gen.ai** — minimal white landing, large bold hero type, floating input bar, clean nav
2. **NeuroNest** — dark sidebar dashboard, colorful stat cards, modular layout
3. **DocuMind AI** — upload-first hero, feature grid, document-centric UX
4. **Education Dashboard** — sidebar nav, progress cards, quiz/score UI

### Rules
- Both **dark mode and light mode** supported
- Colors strictly from the 4 reference screenshots — agent decides exact hex codes
- NO generic AI purple/blue palette
- Animations: fadeUp on scroll, shimmer on loading, float on hero illustrations, typewriter on AI states
- Typography: large bold hero (700 weight, tight letter-spacing), clean body, uppercase labels
- Cards: subtle borders, generous whitespace, rounded-xl
- NO vibe-coded aesthetic — industry-level finish

### Component Patterns
- Stat cards with colored icon backgrounds (like NeuroNest)
- Drag-and-drop upload zone (like DocuMind)
- Sidebar navigation (like Education Dashboard)
- Floating AI input bar (like gen.ai)
- Progress/score badges on topic cards
- Heatmap grid for topic coverage

---

## AI Architecture

### PDF Processing Pipeline
```
User uploads PDF
     ↓
Is it image-based? (check if text extraction returns <50 chars)
     ↓ YES                        ↓ NO
pdf.js → render page        pdfjs text extraction
as canvas → base64 image         ↓
     ↓                      raw text
Send image to Gemini 1.5 Flash (vision)
     ↓
Structured text output
     ↓
Send to Gemini 1.5 Flash (text analysis)
     ↓
JSON: { topics, frequency, difficulty, yearWise, studyPlan }
```

### AI Utilities
- `src/utils/visionAI.js` — Gemini 1.5 Flash (`VITE_GEMINI_KEY`). Image-only. Takes base64 JPEG, returns extracted text.
- `src/utils/callAI.js` — Gemini 1.5 Flash (`VITE_GEMINI_KEY`). Text analysis only. Takes prompt + systemPrompt strings.

### Analysis Prompt Structure
- System: expert exam analyst
- User: extracted text from all uploaded PDFs + syllabus
- Output: strict JSON with topics array, frequency scores, difficulty ratings, year-wise distribution, recommended study hours per topic

---

## Features to Build (Priority Order)
1. ✅ Landing page (animated hero, feature grid, CTA)
2. ✅ App shell (sidebar + routing)
3. ✅ Multi-PDF upload with drag-and-drop
4. ✅ PDF processing pipeline (text + image-based)
5. ✅ AI topic extraction + frequency analysis
6. ✅ Visual analytics dashboard (charts + heatmap)
7. ✅ Topic importance scoring cards
8. ✅ Syllabus cross-reference + gap highlighting
9. ✅ Smart study planner generation
10. ✅ Practice question suggestions

---

## Evaluation Checklist
- [ ] UX polished, dark + light mode working (25%)
- [ ] All core features functional (20%)
- [ ] Creative AI approach — not just summarization (20%)
- [ ] Clean code + README with demo video (20%)
- [ ] Demo video recorded and linked in README (15%)
- [ ] Hosted on Vercel/Netlify (bonus)

---

## Environment Variables
```
VITE_GEMINI_KEY=your_gemini_key_here     ← Google AI Studio (vision + analysis)
```

---

## Current Progress
- [x] Project scaffolded (React + Vite, all deps installed)
- [x] Landing page built (gen.ai style, Framer Motion, dark+light)
- [x] App shell + routing (Sidebar, TopBar, PageWrapper, React Router)
- [x] Upload page (DocuMind drag-drop, file list, syllabus zone, analyze button)
- [x] AI pipeline (callAI, pdfToText with vision fallback, analyzePapers structured JSON)
- [x] Dashboard wired to real AI data (stat cards, charts, topic grid, summary, syllabus gaps)
- [x] Study planner wired to AI data (topic allocation, weekly calendar from sessions, regenerate plan)
- [x] Syllabus page wired (donut coverage chart, gap cards, topic comparison bars)
- [x] Data persistence (zustand persist middleware, localStorage, session notice, clear button)
- [ ] README + demo video
- [ ] GitHub pushed + Unstop submitted

---

## Agent Handoff Notes
_(Update this section every 30–45 min when switching agents)_

**Last updated:** 2026-05-03T15:30Z  
**Last completed:** Performance: parallelized PDF extraction pipeline. pdfToText.js now extracts text from all pages via Promise.all, separates text vs image pages, batches vision calls (5 at a time), caps at 15 pages per PDF, truncates output to 8000 chars, uses scale 1.5 + JPEG 0.7 for smaller payloads. Upload.jsx processes all PDFs simultaneously via Promise.all instead of sequential loop. visionAI.js + callAI.js have defensive Gemini response parsing (handles empty candidates, RECITATION finishReason, etc.).  
**Currently working on:** Nothing — parallelization complete. Next: README + demo video + deploy.  
**Known issues / blockers:** PageWrapper uses fixed marginLeft:260. pdfjs-dist v5 worker may need version alignment if PDF parsing fails. Gemini may return RECITATION for copyrighted content pages (handled gracefully, returns empty string).  
**Files modified last:** src/utils/pdfToText.js, src/pages/Upload.jsx, src/utils/visionAI.js, src/utils/callAI.js, claude.md
