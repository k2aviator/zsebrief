import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
// DELETE import GetAirportList from './GetAirportList';
// DELETE import Login from './Login'
// DELETE import firebase from 'firebase/compat/app'
import { Link } from 'react-router-dom';
import { convertTime12to24 } from './utilTime'
import './Zsebrief.css';
import logo from './icons/zsebrief.png'


export default function Header() {
    const [time, setTime] = useState(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22));
    const [pstTime, setPstTime] = useState()

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

    //Logout

    const signOut = ()=> {
        localStorage.removeItem('token');
        setTimeout(() => {
            // Redirect the user to the desired page
            window.location.href = '/';
          }, 1000);
    }


    //Display home content
    
    return (
        <div>
            <div className="header-box-top">
            <noscript><iframe title="Google Analytics" src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
 
                <div className="header-logo">   
                    <Link to="/home"><img alt="zse brief logo" src={logo}></img></Link>  
                </div>
      
                <div className="header-right-top">
                        <div className="header-welcome">
                        Time is {time}Z | {pstTime} PST
                        </div>
                        <div className="header-signout">
                        <button onClick={signOut}>Sign out</button>
                        </div>
                    </div>
            </div>
            <div className="header-box-bottom">
                <div className="header-box-bottom-item"><Link to="/home">Home</Link> </div>
                {/* <div className="header-box-bottom-item"><Link to="/tracker">Tracker</Link></div> */}
            </div>
        </div>
    )
}
