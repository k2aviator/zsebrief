import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import GetAllAirportRunwaysEdit from './GetAirportRunwaysEdit'
import AirportDisplayOverview from './AirportDisplayOverview'
import GetAirportDeparturesEdit from './GetAirportDeparturesEditList'
import UtilAdminRole from './UtilAdminRole';
import Header from './Header';
import Footer from './Footer'
import { Link } from 'react-router-dom';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

export default function AirportEdit(){

    /* eslint-disable */ 
    const [hasError, setHasError] = useState(false);
    /* eslint-enable */
    
    const location = useLocation()
    const airportICAO = location.state.airportICAO
    const isAdminRole = UtilAdminRole()
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
                            <h3>Details for {airportICAO}</h3>
                        </div>
                        <div>
                            <h4>Airport details:</h4> 
                        </div>
                            <AirportDisplayOverview airportICAO={airportICAO}/>
                            {isAdminRole && <div>
                                <Link to={`/details/${airportICAO}/overview`} state={{airportICAO}}> <button className={buttonDark}>Edit General Airport Information</button></Link><br></br>
                                &nbsp;<br></br>
                            </div>}
        
                        <div>
                            <h4>Airport runway details:</h4> 
                        
                        </div>
                        <GetAllAirportRunwaysEdit airportICAO={airportICAO}/>

                        {isAdminRole && <div>
                                <Link to={`/details/${airportICAO}/runways`} state={{airportICAO}}> <button className={buttonDark}>Edit Runway Information</button></Link><br></br>
                                &nbsp;<br></br>
                            </div>}
                        <div>
                            <h4>All departure information:</h4> 
                            {isAdminRole && <div>
                            <Link to={`/details/${airportICAO}/departures/add-new`} state={{airportICAO}}> <button className={buttonDark}>Add new departure</button></Link><br></br>
                            <p></p>
                            </div>}           
                        </div>
                        <GetAirportDeparturesEdit airportICAO={airportICAO}/>
                        &nbsp;<br></br>
                        &nbsp;<br></br>
                </div>       
            <div className={`footer-${themeName}`}>
                <Footer/> 
            </div>
        </div>
    )
}
