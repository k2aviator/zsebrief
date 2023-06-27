import React, { useState, useEffect, useContext  } from 'react';
import ThemeContext, {ThemeController} from './ThemeContext'
import { Link, useLocation } from 'react-router-dom';
import { convertTime12to24 } from './utilTime'
import UtilAdminRole from './UtilAdminRole';
import useTheme from './useTheme';
import Button from './Button'
import './Zsebrief.css';
import logo from './icons/zsebrief.png'


export default function MobileHeader({isMobile}) {
    const [time, setTime] = useState(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22));
    const [pstTime, setPstTime] = useState()
    const [showDropdown, setShowDropdown] = useState(false);
    const { themeName, toggleTheme } = useContext(ThemeContext)
    const buttonDark = themeName === "dark" ? 'button-dark' : '';
    const aDark = themeName === "dark" ? 'a-dark' : '';
    const headerWelcomeDark = themeName === "dark" ? '-dark' : '';
    const liDark = themeName === "dark" ? 'li-dark' : '';

    const isAdminRole = UtilAdminRole()

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


    const toggleDropdown = () => {
        setShowDropdown(prevState => !prevState);
      };


    //Dark mode button
    function Form() {
        return (
            <form>
                <Button />
            </form>
        )

    }

    console.log("is mobile ", isMobile)
    //Display home content

    return (
        <header>
            <noscript><iframe title="Google Analytics" src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
            <div>
                <div className={`header-box-top`}>             
                    <div className="header-logo">   
                        <img alt="zse brief logo" src={logo} className={`image-${themeName}`}></img>
                    </div>
        
                    <div className={`header-right-top`}>
                            <div className={`header-welcome${headerWelcomeDark}`}>
                                <span>{time}Z | </span>
                                <span>{pstTime} PST </span>
        
                            </div>
                            <div className="header-night-mode">
                            <Button/>
                            </div>
                    </div>
                </div>
                </div>               
        </header>
    )
}
