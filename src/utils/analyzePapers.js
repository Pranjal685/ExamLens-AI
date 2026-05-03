import { callAI } from './callAI'

export async function analyzePapers(extractedTexts, syllabusText = '') {
  const combinedPapers = extractedTexts
    .map((t, i) => `--- PAPER ${i + 1} ---\n${t.text}\n`)
    .join('\n')

  const systemPrompt = `You are an expert exam analyst. Analyze past question papers and return ONLY valid JSON with no markdown, no explanation, just the JSON object.`

  const userPrompt = `Analyze these past exam papers and syllabus. Return a JSON object with exactly this structure:

{
  "topics": [
    {
      "name": "Topic Name",
      "frequency": 45,
      "priority": "HIGH",
      "difficulty": "Hard",
      "years": ["2022", "2023", "2024"],
      "score": 92,
      "studyHours": 8,
      "questionTypes": ["MCQ", "Long Answer"],
      "practiceQuestions": [
        "Write a practice question similar to what appeared",
        "Write another practice question"
      ]
    }
  ],
  "yearWiseTrend": [
    { "year": "2020", "topicCount": 18 },
    { "year": "2021", "topicCount": 21 }
  ],
  "syllabusGaps": ["Topic not covered in papers", "Another gap topic"],
  "overallCoverage": 89,
  "totalTopics": 24,
  "highPriorityCount": 8,
  "studyPlan": [
    {
      "topic": "Topic Name",
      "priority": "HIGH",
      "hoursPerWeek": 8,
      "color": "#color matching priority",
      "sessions": [
        { "day": "Monday", "startTime": "09:00", "duration": 2 },
        { "day": "Wednesday", "startTime": "14:00", "duration": 2 }
      ]
    }
  ],
  "summary": "2-3 sentence human-readable summary of the analysis"
}

Important rules:
- Return between 6 and 15 topics
- frequency values should be between 10 and 100
- score values should be between 20 and 100
- priority must be one of: "HIGH", "MEDIUM", "LOW"
- difficulty must be one of: "Hard", "Medium", "Easy"
- yearWiseTrend should have entries for each distinct year found
- studyPlan sessions day must be one of: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
- startTime must be in HH:00 format (full hours like "09:00", "14:00")
- color should be a valid hex color matching priority: red-ish for HIGH, amber for MEDIUM, green for LOW
- Return 2-5 syllabusGaps even if syllabus not provided (use common gaps)

PAPERS:
${combinedPapers}

SYLLABUS:
${syllabusText || 'No syllabus provided — analyze papers only'}

Return ONLY the JSON. No explanation. No markdown fences.`

  const raw = await callAI(userPrompt, systemPrompt)

  try {
    return JSON.parse(raw)
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse AI response as JSON')
  }
}
