import React from 'react';
import { useLocation } from 'react-router-dom'
import GetAirportDetailsEdit from './GetAirportDetailsEdit'
import Header from './Header';
import Footer from './Footer'
import { Link } from 'react-router-dom';

export default function AirportEditOverview(){

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
                        <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button>Back to all details</button></Link><br></br>            
                    </div>
                    <div>
                        <h3>Overview Information for {airportICAO}</h3>
                    </div>
                    <GetAirportDetailsEdit airportICAO={airportICAO}/>
            </div>
            <div className="footer">
                <Footer/> 
            </div>
        </div>
    )
}
