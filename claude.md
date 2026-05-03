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
- **AI:** OpenRouter API (key in `.env` as `VITE_OPENROUTER_KEY`)
- **Models:** `google/gemini-2.0-flash` (vision/image PDFs) + `anthropic/claude-3.5-sonnet` (analysis)
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
Send image to vision model (gemini-2.0-flash via OpenRouter)
     ↓
Structured text output
     ↓
Send to claude-3.5-sonnet for topic analysis
     ↓
JSON: { topics, frequency, difficulty, yearWise, studyPlan }
```

### Core AI Utility
```js
// src/utils/callAI.js
export async function callAI(messages, model = "anthropic/claude-3.5-sonnet") {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
    },
    body: JSON.stringify({ model, messages, max_tokens: 4000 })
  });
  const data = await res.json();
  return data.choices[0].message.content;
}
```

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
VITE_OPENROUTER_KEY=your_key_here
```

---

## Current Progress
- [x] Project scaffolded (React + Vite, all deps installed)
- [x] Landing page built (gen.ai style, Framer Motion, dark+light)
- [x] App shell + routing (Sidebar, TopBar, PageWrapper, React Router)
- [x] Upload page (DocuMind drag-drop, file list, syllabus zone, analyze button)
- [ ] AI pipeline
- [x] Dashboard (stat cards, Recharts charts, topic cards, heatmap)
- [x] Study planner (weekly calendar, topic list, priority badges)
- [ ] README + demo video
- [ ] GitHub pushed + Unstop submitted

---

## Agent Handoff Notes
_(Update this section every 30–45 min when switching agents)_

**Last updated:** 2026-05-03T07:35Z  
**Last completed:** Frontend shell complete — Landing, Upload, Dashboard, Planner, Syllabus pages all built and verified running at localhost:5173  
**Currently working on:** AI pipeline (callAI.js is stubbed, pdfToImages.js + parseAnalysis.js need implementation)  
**Known issues / blockers:** Stitch MCP design system tool had invalid argument errors — used Stitch screen generation directly with inline prompts. Colors match reference screenshots (indigo #6366f1 accent, #010816 dark primary, pastel stat cards).  
**Files modified last:** src/pages/Landing.jsx, Upload.jsx, Dashboard.jsx, Planner.jsx, Syllabus.jsx, src/components/layout/Sidebar.jsx, TopBar.jsx, PageWrapper.jsx, src/store/useAppStore.js, src/index.css, vite.config.js, main.jsx, App.jsx
