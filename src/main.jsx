import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PdfCarousel from './editpdf.jsx'
import PdfUploader from './Mail.jsx'
import Simulation from './Simulation.jsx'
import Myurls from './Myurls.jsx'
// import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Myurls />
  </StrictMode>,
)
