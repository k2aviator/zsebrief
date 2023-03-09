import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import GetAirportList from './GetAirportList';
import Login from './Login'
import firebase from 'firebase/compat/app'
import './Zsebrief.css';

//console.log("db auth ", db)
//npm install --save moment react-moment


export default function Home() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(false)
    const [user, setUser] = useState({})
    const [time, setTime] = useState(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22));
    const [pstTime, setPstTime] = useState()

    

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
            setPstTime(convertTime12to24(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}).substring(9,20).trim()))
            // setPstTime(pstDate)
        , 1000);
        return () => {
            clearInterval(pstInterval);
        };
        }, []);

    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');
      
        let [hours, minutes] = time.split(':');
      
        if (hours === '12') {
          hours = '00';
        }
        if (hours === '10') {
            hours = '22';
          } 
        if (modifier === 'PM') {
           hours = parseInt(hours, 10) + 12;
            
        }
      
        return `${hours}${minutes}`;
      }

    // //tester
    // const convertHoursto24 = (time) => {
    // let [hours, modifier] = time.split(' ');
    // if (hours === '12') {
    //     hours = '00';
    // }
    // if (hours === '10') {
    //     hours = '22';
    //     } 
    // if (modifier === 'PM') {
    //     hours = parseInt(hours, 10) + 12;
        
    // }
    // console.log("input ", time)
    // console.log("output ", hours, modifier)
    // }


    // const digitsToLoop = 12

    // for (let i = 1; i <= digitsToLoop; i++){
    //     convertHoursto24(i + " AM ")

    // }


    //Display home content

    if (user){
    return (
        <div className="body">
           
            <div className="sticky-header">
                 <Nav />
                <p>Welcome, {user && userName}! <br></br> 
                Time is {time}Z | {pstTime} PST<br></br>
                <button onClick={()=> {
                    firebase.auth().signOut();
                    navigate("/");
                    }}>Sign out</button></p>
            </div>
            <GetAirportList pstTime={pstTime}/> 
        </div>
    );} else {
    return(
        <Login />
    )
    }
}
