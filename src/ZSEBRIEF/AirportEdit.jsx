import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { useLocation } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom';
import GetAllAirportRunwaysEdit from './GetAirportRunwaysEdit'
import GetAirportDetailsEdit from './GetAirportDetailsEdit'
import firebase from 'firebase/compat/app'
import Login from './Login'

// https://blog.bitsrc.io/build-a-simple-modal-component-with-react-16decdc111a6
export default function AirportEdit(){

    const navigate = useNavigate();
    const [userName, setUserName] = useState(false)
    const [user, setUser] = useState({})
    const [time, setTime] = useState(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22));


    //Set user display name 
    useEffect(() =>{
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setUser(user)
            setUserName(user.displayName)
        })

        return () => unregisterAuthObserver();
    },[user])

    const location = useLocation()
    const {from} = location.state
    const airportICAO = location.state.airportICAO


    if (user){
    return(
        <div className="body">
            <Nav />
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
      
    )
    } else {
        return(
            <Login />
        )
    }

}
