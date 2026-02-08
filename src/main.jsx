import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/designSystem.css'
import './index.css'
import './styles/modernDashboard.css'
import './styles/modernCreateCard.css'
import './styles/modernCard.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
