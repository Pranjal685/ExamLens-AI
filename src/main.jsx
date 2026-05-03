import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Apply dark mode by default (can be toggled)
document.documentElement.classList.add('dark')

if (!import.meta.env.VITE_GEMINI_KEY) {
  console.error('Missing VITE_GEMINI_KEY. Create a .env file with your Gemini API key.')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
