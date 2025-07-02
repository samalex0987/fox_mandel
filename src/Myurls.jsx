
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from "./App";
import Simulation from "./Simulation";
import Test from './test';


function Myurls(){


    return(
        <>
        <BrowserRouter>
          <Routes>
             <Route path="/simulation" element={<App />} />
             <Route path="/" element={<Simulation />} />
             <Route path="/test" element={<Test />} />
          </Routes>
        </BrowserRouter>
        </>
    )
}

export default Myurls;