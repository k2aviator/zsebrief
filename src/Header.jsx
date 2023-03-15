import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetAirportList from './GetAirportList';
import Login from './Login'
import firebase from 'firebase/compat/app'
import { Link } from 'react-router-dom';
import { convertTime12to24 } from './utilTime'
import './Zsebrief.css';



export default function Header() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(false)
    const [user, setUser] = useState({})
    const [time, setTime] = useState(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22));
    const [pstTime, setPstTime] = useState()

    let timePstOutput;

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

     //Set PST Time
    useEffect(() => {
    const pstInterval = setInterval(() => 
        setPstTime(convertTime12to24(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}).substring(10,21).trim()))
    , 1000);
    return () => {
        clearInterval(pstInterval);
    };
    }, []);

    


    //Display home content

    if (user){
    return (
        <div>
            <div>
                <Link to="/home"><h1 className="logo-text">ZSEBRIEF</h1></Link>  
                <Link to="/home">Home</Link>  | <Link to="/tracker">Tracker</Link>  
            </div>
            <div>
                <p>Welcome, {user && userName}! <br></br> 
                Time is {time}Z | {pstTime} PST<br></br>
                <button onClick={()=> {
                    firebase.auth().signOut();
                    navigate("/");
                    }}>Sign out</button></p>
            </div>
        </div>
         
    );} else {
    return(
        <Login />
    )
    }
}
