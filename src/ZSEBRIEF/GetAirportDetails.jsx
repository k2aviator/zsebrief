import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import ReactDOM from "react-dom";
import GetAirportRunways from './GetAirportRunways'
import GetAirportMETAR from './GetAirportMETAR'
import AirportEditModal from './AirportEdit'
import { Link } from 'react-router-dom';

//https://blog.openreplay.com/creating-a-collapsible-component-for-react/
//Expand and collapse airports
export default function GetAirportDetails({airportICAO, airportName, airportTowered, airportHoursOpen, airportHoursClose, airspaceClass, airportElev}) {  
    //console.log(airportState)
    const [open, setOpen] = useState(false)
    const [airportOpen,setAirportOpen] = useState(false)

    const toggle = () =>{
        setOpen(!open);
        // console.log(airportICAO, airportTowered, airportHoursOpen)
        if( airportTowered === "TRUE"){
            setAirportOpen(!airportOpen)
        }
    }


    return (
        <div className="airport-details-box">
            <div className="airport-code-name" onClick={()=>toggle(airportICAO,airportTowered,airportHoursOpen,airportHoursClose)}>
                <div id="airportName" >
                    <button className="button">{airportICAO} | {airportName} </button>
                    {open && <div className="collapsible-expand">
                        <div> Airspace {airspaceClass} | Elevation: {airportElev}</div>
                        
                        {airportOpen && <div className="">
                            Towered | Open: {airportHoursOpen}-{airportHoursClose}
                        </div>}
                        <GetAirportRunways airportICAO={airportICAO}/>
                        <p></p>
                        <div>
                            <Link to="/airportedit" state={{airportICAO}}> <button>All Details</button></Link>
                        </div>
                    </div>}
                </div> 
            </div>
        </div>
    )

}

GetAirportDetails.propTypes = {
}