import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TiketsWithPayment from './TiketsWithPayment';
import Bank from './Bank';
import Votacion from './Votacion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TiketsNFT from './TiketsNFT';
import Piedra from './Piedra';
import Registro from './Registro';

function App() {
  return (
    <div>
       <Routes>
          <Route path="/TiketsWithPayment" element={<TiketsWithPayment />}/>
          <Route path="/Bank" element={<Bank />}/>
          <Route path="/Votacion" element={<Votacion />}/>
          <Route path="/TiketsNFT" element={<TiketsNFT />}/>
          <Route path="/Piedra" element={<Piedra />}/>
          <Route path="/Registro" element={<Registro />}/>
          <Route path="/" element={<h1>Sample</h1>}/>
       </Routes>
    </div>
  )

}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
