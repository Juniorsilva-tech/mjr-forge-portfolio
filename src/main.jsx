import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './scene-transitions.css'
import './premium-polish.css'
import './mobile-menu-forge.css'
import './forge-theme.css'
import './performance-menu.js'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
