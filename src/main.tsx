import '@/styles/globals.css'
import { createRoot } from 'react-dom/client'

import App from './app'

const dom = document.getElementById('root') as HTMLElement
if (dom) createRoot(dom).render(<App />)
