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


    
    
    const convertTime12to24 = (time12h) => {
     
        if (time12h.length === 10){
            let [time, modifier] = time12h.split(' ');
            // console.log('length = 10');
            // console.log("time", time, "modifier", modifier)
            let [hours, minutes, secs] = time.split(':')
            
            if (hours === '12' && modifier === 'AM') {
                hours = '00';
                timePstOutput = `${hours}${minutes}`
            } else if (modifier === 'PM') {
                hours = parseInt(hours) + 12;
                //console.log(hours, minutes, secs)
                timePstOutput = `${hours}${minutes}`
            } else if (parseInt(hours) < 10 ){
                timePstOutput = `0${hours}${minutes}`         
            } else {
                timePstOutput = `${hours}${minutes}`
            }
            // console.log(timePstOutput)
        } else {
                let [time, modifier] = time12h.split(' ');
                let [hours, minutes, secs] = modifier.split(':')
                //console.log('length = 11')
                if (hours === '12' && modifier === 'AM') {
                    hours = '00';
                    timePstOutput = `${hours}${minutes}`
                } if (modifier === 'PM') {
                    hours = parseInt(hours) + 12;
                    //console.log(hours, minutes, secs)
                    timePstOutput = `${hours}${minutes}`
                } else {
                    timePstOutput = `${hours}${minutes}`
                }
                //console.log(timePstOutput)
        }
    return timePstOutput
        // console.log(time12h.length)
        // console.log("time 12 hour",time12h)
        
        // let [hours, minutes, secs] = modifier.split(':');

        // console.log("time", time)
        // console.log("modifier", modifier)
        // console.log("hours", hours)
        // console.log("minutes", minutes)

            
        // }

        // ///new code for correct format
        // if (hours.length === 1 ){
        //     // console.log("length 1")
        // } else {
        //     // console.log("length more than 1")

        // }
        // // console.log("hours", hours, " minutes", minutes, " modifier", time)
        // return `${hours}${minutes}`;
    }


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
