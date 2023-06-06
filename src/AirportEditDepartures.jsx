import React from 'react';
import { useLocation } from 'react-router-dom'
import GetAirportDeparturesEdit from './GetAirportDeparturesEditList'
import Header from './Header';
import Footer from './Footer'
import { Link } from 'react-router-dom';

export default function AirportEditDepartures(){

    const location = useLocation()
    const airportICAO = location.state.airportICAO

    return (
        <div>
            <div className="header-nav">
            </div>
       
            <div className='main-body'>
                <div className="sticky-header">
                <Header />
                </div>
                    <div className="details-margin-top">
                        <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button>Back to all details</button></Link>&nbsp;
                        <Link to={`/details/${airportICAO}/departures/add-new`} state={{airportICAO}}> <button>Add new departure</button></Link>           
                    </div>
                    <div>
                        <h3>Departure Information for {airportICAO}</h3>
                    </div>
                    <GetAirportDeparturesEdit airportICAO={airportICAO}/>
            </div>
            <div className="footer">
                <Footer/> 
            </div>
        </div>
    )
}
