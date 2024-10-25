import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SpotifyProvider } from './SpotifyContext'; // Import SpotifyProvider


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SpotifyProvider>
      <App />
    </SpotifyProvider>
  </StrictMode>,
)
