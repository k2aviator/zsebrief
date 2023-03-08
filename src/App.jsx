import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './ZSEBRIEF/Home';
import AirportEdit from './ZSEBRIEF/AirportEdit'
import Login from './ZSEBRIEF/Login'
import './App.css';
import './ZSEBRIEF/Zsebrief.css';


function App() {
  //<Route path = "/airports" element={<GetAirportList />}/>
  return (
    <div>
     <Routes>
        <Route path = "/" element={<Login />}/>
        <Route path = "/home" element={<Home />}/>
        <Route path = "/airportedit" element={<AirportEdit />}/>
     </Routes>  
    </div>
  );
}

export default App;
