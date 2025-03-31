import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'aos/dist/aos.css'
import App from './App.jsx'
import AOS from 'aos'
import ReactGA from "react-ga4";

// ?Iniciar Analityc la app
ReactGA.initialize("G-ZPQ0YG91K6");

// todoIniciar AOS al arrancar la app
AOS.init({ duration: 1000, once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
