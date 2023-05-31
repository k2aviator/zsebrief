import React, { useState, useEffect } from 'react';
import GetAirportList from './GetAirportList';
import Header from './Header';
import Footer from './Footer'
import './Zsebrief.css';
import { convertTime12to24 } from './utilTime'

//console.log("db auth ", db)
//npm install --save moment react-moment


export default function Home() {
    const [pstTime, setPstTime] = useState()

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
    );
}
