import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY — add it to your .env.local and Vercel environment variables')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#f59e0b',
          colorBackground: '#0f0f0f',
          colorInputBackground: '#0f0f0f',
          colorInputText: '#e8e4d8',
          colorText: '#e8e4d8',
          colorTextSecondary: '#888',
          colorNeutral: '#333',
          borderRadius: '6px',
          fontFamily: "'DM Mono', monospace",
        },
        elements: {
          card: { backgroundColor: '#141414', border: '1px solid #2a2a2a', boxShadow: 'none' },
          headerTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, letterSpacing: '0.05em' },
          headerSubtitle: { color: '#666' },
          formButtonPrimary: { backgroundColor: '#f59e0b', color: '#0a0a0a', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.08em', fontSize: '14px' },
          footerActionLink: { color: '#f59e0b' },
          identityPreviewText: { color: '#e8e4d8' },
          organizationSwitcherTrigger: { backgroundColor: '#141414', border: '1px solid #2a2a2a' },
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
