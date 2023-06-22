import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import GetAllAirportRunwaysEdit from './GetAirportRunwaysEdit'
import Header from './Header';
import Footer from './Footer'
import { Link } from 'react-router-dom';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

export default function AirportEditRunways(){

    const location = useLocation()
    const airportICAO = location.state.airportICAO
    const { themeName, toggleTheme } = useContext(ThemeContext)
   
    return (
        <div className={`parent-${themeName}`}>
            <div className={`header-nav-${themeName}`}>
            </div>
       
            <div className='main-body'>
                <div className="sticky-header">
                <Header />
                </div>
                    <div className="details-margin-top">
                        <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button>Back to all details</button></Link><br></br>            
                    </div>
                    <div>
                        <h3>Runway Information for {airportICAO}</h3>
                    </div>
                    <GetAllAirportRunwaysEdit  airportICAO={airportICAO}/>
            </div>
            <div className={`footer-${themeName}`}>
                <Footer/> 
            </div>
        </div>
    )
}
