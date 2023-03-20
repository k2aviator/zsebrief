import React, { useState, useEffect } from 'react';
import Nav from './x Nav';
import { useLocation } from 'react-router-dom'
import GetAllAirportRunwaysEdit from './GetAirportRunwaysEdit'
import GetAirportDetailsEdit from './GetAirportDetailsEdit'
import Header from './Header';
import firebase from 'firebase/compat/app'
import Login from './Login'
import Footer from './Footer'

// https://blog.bitsrc.io/build-a-simple-modal-component-with-react-16decdc111a6
export default function AirportEdit(){

    const [user, setUser] = useState({})


    //Set user display name 
    useEffect(() =>{
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setUser(user)
        })

        return () => unregisterAuthObserver();
    },[user])

    const location = useLocation()
    const airportICAO = location.state.airportICAO
    console.log(location)

    if (user){
    return(
        <div>
            <div className="header-nav">
            </div>
       
            <div className='main-body'>
                <div className="sticky-header">
                <Header />
                </div>
                    <div>
                        <h3>Edit details for {airportICAO}</h3>
                    </div>
                    <div>
                        <h4>Airport details:</h4> 
                    </div>
                    <GetAirportDetailsEdit airportICAO={airportICAO}/>
                    <div>
                        <h4>Airport runway details:</h4> 
                    </div>
                    <GetAllAirportRunwaysEdit airportICAO={airportICAO}/>
            </div>
            <div className="footer">
                <Footer/> 
            </div>
        </div>
      
    )
    } else {
        return(
            <Login />
        )
    }

}
