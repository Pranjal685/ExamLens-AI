/* global process */
// Lightweight local server to simulate Vercel serverless functions
// Run with: node dev-api-server.js
import { createServer } from 'http'
import { config } from 'dotenv'

config() // loads .env

const PORT = 3000

// Dynamically import the handler modules
const geminiHandler = (await import('./api/gemini.js')).default
const visionHandler = (await import('./api/vision.js')).default

function createReqRes(req, body) {
  req.body = body

  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, val) { this.headers[key] = val; return this },
    status(code) { this.statusCode = code; return this },
    json(data) { this._data = data; this._done = true; return this },
    end() { this._done = true; return this },
    _done: false,
    _data: null,
  }

  return { req, res }
}

const server = createServer(async (httpReq, httpRes) => {
  // Collect body
  let rawBody = ''
  for await (const chunk of httpReq) rawBody += chunk
  let body = {}
  try { body = JSON.parse(rawBody) } catch { /* ignore parse error */ }

  const { req, res } = createReqRes(
    { method: httpReq.method, headers: httpReq.headers, body, url: httpReq.url },
    body
  )

  try {
    if (httpReq.url === '/api/gemini') {
      await geminiHandler(req, res)
    } else if (httpReq.url === '/api/vision') {
      await visionHandler(req, res)
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  } catch (err) {
    console.error('Handler error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }

  // Write response
  httpRes.writeHead(res.statusCode, {
    'Content-Type': 'application/json',
    ...res.headers,
  })
  httpRes.end(res._data ? JSON.stringify(res._data) : '')
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  API server running at http://localhost:${PORT}`)
  console.log(`  Routes: POST /api/gemini, POST /api/vision`)
  console.log(`  GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ loaded' : '✗ MISSING'}\n`)
})
