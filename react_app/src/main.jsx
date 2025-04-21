import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const styleObj = {
  display:"flex",
  flexDirection:"Column",
  alignItems: "Center",
  justifyContent:"Center",
  width: "500px",
  height: "500px",
}

const rootElement = document.getElementById('root');
Object.assign(rootElement.style, styleObj);

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
