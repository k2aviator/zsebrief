import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import AirportEdit from './AirportDetails'
import AirportEditOverview from './AirportEditOverview'
import AirportEditRunways from './AirportEditRunways'
import AirportEditDepartures from './AirportEditDepartures'
import Login from './Login'
import './App.css';
import './Zsebrief.css';


function App() {

  const isAuthenticated = function checkIfUserIsAuthenticated(){
    //console.log("check if user is authenticated function")
    var token = localStorage.getItem('token');
    if (token){
      //console.log("token exists, login ", token)
      return true
    } else {
      //console.log("no token exists")
      return false
    }
    
  }

  return (
    <div>
     <Routes>
        {/* <Route path = "/" element={<Login />}/> */}
        <Route path = "/" element={isAuthenticated() === true ? <Home />: <Login />}/>
        <Route path = "/signup" element={<Signup />}/>
        <Route path = "/home" element={isAuthenticated() === true ? <Home />: <Navigate to="/" replace />}/>
        <Route path = "/details/:icao" element={isAuthenticated() === true ? <AirportEdit/>: <Navigate to="/" replace />}/>
        <Route path = "/details/:icao/overview" element={isAuthenticated() === true ? <AirportEditOverview/>: <Navigate to="/" replace />}/>
        <Route path = "/details/:icao/runways" element={isAuthenticated() === true ? <AirportEditRunways/>: <Navigate to="/" replace />}/>
        <Route path = "/details/:icao/departures" element={isAuthenticated() === true ? <AirportEditDepartures/>: <Navigate to="/" replace />}/>
     </Routes>  
    </div>
  );
}

export default App;
