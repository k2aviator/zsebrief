import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { Link, useNavigate } from 'react-router-dom';
import GetAirportList from './GetAirportList';
import Login from './Login'
import firebase from 'firebase/compat/app'
import './Zsebrief.css';
import db from '../db';

//console.log("db auth ", db)



export default function Home() {
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


    //Set zulu time
    useEffect(() => {
        const interval = setInterval(() => 
        setTime(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22)), 1000);
    
        return () => {
          clearInterval(interval);
        };
      }, []);



    //Display home content

    if (user){
    return (
        <div className="body">
           
            <div className="sticky-header">
                 <Nav />
                <p>Welcome, {user && userName}! <br></br> 
                Time is {time}Z<br></br>
                <button onClick={()=> {
                    firebase.auth().signOut();
                    navigate("/");
                    }}>Sign out</button></p>
            </div>
            <GetAirportList /> 
        </div>
    );} else {
    return(
        <Login />
    )
    }
}
