import React, { useState, useEffect, useContext } from 'react';
import GetAirportList from './GetAirportList';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'
import Header from './Header';
import Footer from './Footer'
import './Zsebrief.css';
import { convertTime12to24 } from './utilTime'


export default function Home() {
    const [pstTime, setPstTime] = useState()
    const { themeName, toggleTheme } = useContext(ThemeContext)

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
        <div className={`parent-${themeName}`}>
            <div className={`header-nav-${themeName}`}>
            </div>
            <div className='main-body'>
                <div className={`sticky-header-${themeName}`}>     
                    <Header />
                </div>
                <div>
                    <GetAirportList pstTime={pstTime}/> 
                </div>
            
            </div>
            <div className={`footer-${themeName}`}>
                <Footer/> 
            </div>
        </div>
    );
}
