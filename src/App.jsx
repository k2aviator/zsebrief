import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import AirportEdit from './AirportEdit'
import NearbyAirplanes from './NearbyAirplanes'
import Login from './Login'
import './App.css';
import './Zsebrief.css';


function App() {
  //<Route path = "/airports" element={<GetAirportList />}/>
  return (
    <div>
     <Routes>
        <Route path = "/" element={<Login />}/>
        <Route path = "/home" element={<Home />}/>
        <Route path = "/airportedit" element={<AirportEdit />}/>
        <Route path = "/tracker" element={<NearbyAirplanes />}/>
     </Routes>  
    </div>
  );
}

export default App;
