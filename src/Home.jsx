import React, { useState, useEffect, useContext } from 'react';
import GetAirportList from './GetAirportList';
import MobileGetAirportList from './MobileGetAirportList';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'
import Header from './Header';
import MobileHeader from './MobileHeader';
import Footer from './Footer'
import './Zsebrief.css';
import { convertTime12to24 } from './utilTime'


export default function Home() {
    const [pstTime, setPstTime] = useState()
    const { themeName, toggleTheme } = useContext(ThemeContext)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWindowWidth = () => {
          const newIsMobile = window.innerWidth <= 600;
          setIsMobile(newIsMobile);
        //   console.log('isMobile:', newIsMobile);
        };
    
     
        // Call the checkWindowWidth function on initial load
        checkWindowWidth();
    
        // Attach an event listener to window resize
        window.addEventListener('resize', checkWindowWidth);
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', checkWindowWidth);
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

    return (
        <div className={`parent-${themeName}`}>
            <div className={`header-nav-${themeName}`}>
            </div>
            <div className='main-body'>
                <div className={`sticky-header-${themeName}`}>     
                    {isMobile === true && <MobileHeader />}
                    {isMobile === false && <Header />}
                </div>
                <div>
                {isMobile === true &&  <MobileGetAirportList pstTime={pstTime}/>}
                {isMobile === false &&  <GetAirportList pstTime={pstTime}/>}
                </div>
            </div>
            <div className={`footer-${themeName}`}>
                <Footer/> 
            </div>
        </div>
    );
}
