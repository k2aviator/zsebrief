import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import GetAirportDetailsEdit from './GetAirportDetailsEdit'
import Header from './Header';
import Footer from './Footer'
import { Link } from 'react-router-dom';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

export default function AirportEditOverview(){

    const location = useLocation()
    const airportICAO = location.state.airportICAO
    const { themeName, toggleTheme } = useContext(ThemeContext)
    const buttonDark = themeName === "dark" ? 'button-dark' : '';
 
    return (
        <div className={`parent-${themeName}`}>
            <div className={`header-nav-${themeName}`}>
            </div>
       
            <div className='main-body'>
                <div className={`sticky-header-${themeName}`}>
                <Header />
                </div>
                <div className="details-margin-top">
                    <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button className={buttonDark}>Back to all details</button></Link><br></br>            
                </div>
                <div>
                    <h3>Overview Information for {airportICAO}</h3>
                </div>
                <GetAirportDetailsEdit airportICAO={airportICAO}/>
            </div>
            <div className={`footer-${themeName}`}>
                <Footer/> 
            </div>
        </div>
    )
}
