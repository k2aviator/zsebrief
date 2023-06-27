import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'
import Home from './Home';
import Signup from './Signup';
import AdminDepsByDClass from './AdminDepsByDClass'
import AdminDepsByCClass from './AdminDepsByCClass'
import AdminDepsByBClass from './AdminDepsByBClass'
import AirportEdit from './AirportDetails'
import AirportEditOverview from './AirportEditOverview'
import AirportEditRunways from './AirportEditRunways'
import AirportEditDepartures from './AirportEditDepartures'
import GetAirportDeparturesEditOne from './GetAirportDeparturesEditOne'
import GetAirportDeparturesAddOne from './GetAirportDeparturesAddOne'
import GetAirportRunwaysEditOne from './GetAirportRunwaysEditOne'
import GetAirportFullPage from './GetAirportFullPage'
import Login from './Login'
import './App.css';
import './Zsebrief.css';


function App() {

  const [isAdminRole, setIsAdminRole] = useState('false')

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
  
    const isAdmin = async () => {
    const mongoIsAdminURL = "https://zsebrief-backend-production.up.railway.app/login/isadmin" //PRODUCTION
    var token = localStorage.getItem('token');
    fetch(mongoIsAdminURL, {
      method:'POST', 
      headers:  {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Set the Authorization header with the token
          },
      }).then(response=> response.json()
      ).then(data=>{
          const isAdmin = data.admin
          setIsAdminRole(isAdmin)
      }).catch (error => {
        // console.error('An error occurred:', error);
      })     
    } 

    useEffect(() => {
      try {
        console.log("is admin function")
        isAdmin(); // Call the isAdmin() function
      } catch (error) {
        console.error('An error occurred:', error); // Handle the error
      }
    },[])
    
  return (
    <ThemeController>
    <div>
     <Routes>
          <Route path = "/" element={isAuthenticated() === true ? <Home />: <Login />}/>
          <Route path = "/signup" element={<Signup />}/>
          <Route path = "/home" element={isAuthenticated() === true ? <Home />: <Navigate to="/" replace />}/>
          <Route path = "/airports/:icao" element={isAuthenticated() === true ? <GetAirportFullPage />: <Navigate to="/" replace />}/>
          <Route path = "/details/:icao" element={isAuthenticated() === true ? <AirportEdit/>: <Navigate to="/" replace />}/>
          <Route path = "/details/:icao/overview" element={isAdminRole === true ? <AirportEditOverview/>: <Navigate to="/" replace />}/>
          <Route path = "/details/:icao/runways" element={isAdminRole === true? <AirportEditRunways/>: <Navigate to="/" replace />}/>
          <Route path = "/details/:icao/departures" element={isAdminRole === true ? <AirportEditDepartures/>: <Navigate to="/" replace />}/>
          <Route path = "/details/:icao/departures/add-new" element={isAdminRole === true ? <GetAirportDeparturesAddOne/>: <Navigate to="/" replace />}/>
          <Route path = "/details/:icao/departures/:id" element={isAdminRole === true ? <GetAirportDeparturesEditOne/>: <Navigate to="/" replace />}/>
          <Route path = "/details/:icao/runways/:id" element={isAdminRole === true ? <GetAirportRunwaysEditOne/>: <Navigate to="/" replace />}/>
          <Route path = "/admin/deps-by-class/d" element={isAdminRole === true ? <AdminDepsByDClass />: <Navigate to="/" replace />}/>
          <Route path = "/admin/deps-by-class/c" element={isAdminRole === true ? <AdminDepsByCClass />: <Navigate to="/" replace />}/>
          <Route path = "/admin/deps-by-class/b" element={isAdminRole === true ? <AdminDepsByBClass />: <Navigate to="/" replace />}/> 
      
       </Routes>  
    </div>

    </ThemeController>
  );
}

export default App;
