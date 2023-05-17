import React, { useState, useEffect } from 'react';
// DELETE import { useNavigate } from 'react-router-dom';
import GetAirportList from './GetAirportList';
import Header from './Header';
import Footer from './Footer'
import Login from './Login'
import firebase from 'firebase/compat/app'
import './Zsebrief.css';
import { convertTime12to24 } from './utilTime'

//console.log("db auth ", db)
//npm install --save moment react-moment


export default function Home() {
    // DELETE const [userName, setUserName] = useState(false)
    const [user, setUser] = useState({})
    // DELETE const [time, setTime] = useState(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22));
    const [pstTime, setPstTime] = useState()

    //Set user display name 
    useEffect(() =>{
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setUser(user)
            //DELETE setUserName(user.displayName)
        })

        return () => unregisterAuthObserver();
    },[user])


    // DELETE Set zulu time
    // useEffect(() => {
    //     const interval = setInterval(() => 
    //     setTime(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22)), 1000);
    //     return () => {
    //       clearInterval(interval);
    //     };
    //   }, []);

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
            <div className="header-nav">
            </div>
            <div className='main-body'>
                <div className="sticky-header">
                    <Header />
                </div>
                <div>
                    <GetAirportList pstTime={pstTime}/> 
                </div>
            
            </div>
            <div className="footer">
                <Footer/> 
            </div>
        </div>
   
    );} else {
    return(
        <Login />
    )
    }
}
