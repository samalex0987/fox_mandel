
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from "./App";
import Simulation from "./Simulation";


function Myurls(){


    return(
        <>
        <BrowserRouter>
          <Routes>
             <Route path="/" element={<App />} />
             <Route path="/simulation" element={<Simulation />} />
          </Routes>
        </BrowserRouter>
        </>
    )
}

export default Myurls;