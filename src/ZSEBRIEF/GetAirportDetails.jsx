import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import ReactDOM from "react-dom";
import GetAirportRunways from './GetAirportRunways'
import GetAirportMETAR from './GetAirportMETAR'
import AirportEditModal from './AirportEdit'
import { Link } from 'react-router-dom';

//https://blog.openreplay.com/creating-a-collapsible-component-for-react/
//Expand and collapse airports
export default function GetAirportDetails({airportICAO, airportName, airportTowered, airportHoursOpen, airportHoursClose, airspaceClass, airportElev, pstTime}) {  
    //console.log(airportState)
    const [open, setOpen] = useState(false)
    const [airportOpen,setAirportOpen] = useState(false) 
    const [towerOpen, setTowerOpen] = useState(false)


    const toggleOpen = () =>{
        setOpen(!open);
        console.log(airportICAO, airportTowered, airportHoursOpen)
        isTowerOpen()
        if( airportTowered === "TRUE"){
            setAirportOpen(!airportOpen)
    
        }
    }

    const isTowerOpen = ()=>{
        if (airportHoursOpen === 2359){
            setTowerOpen("OPEN")

        }
        else if (pstTime > airportHoursOpen) {
            if (pstTime < airportHoursClose){
                // console.log(airportICAO, "OPEN")
                // console.log("time now is ", pstTime)
                // console.log("airport opens at ", airportHoursOpen, " and closes at", airportHoursClose)
                setTowerOpen("OPEN")
            } else {
                console.log(airportICAO, "CLOSED")
                // console.log("time now is ", pstTime)
                // console.log("airport opens at ", airportHoursOpen, " and closes at", airportHoursClose)
                setTowerOpen("CLOSED")
            }
        }
    }
    

    return (
        <div className="airport-details-box">
            <div className="airport-code-name" onClick={()=>toggleOpen()}>
                <div id="airportName" >
                    <button className="button">{airportICAO} | {airportName} </button>
                    {open && <div className="collapsible-expand">
                        <div> Airspace {airspaceClass} | Elevation: {airportElev}</div>
                        
                        {airportOpen && <div className="">
                            Towered | Open: {airportHoursOpen} -{airportHoursClose}<br></br>
                            Local time is {pstTime} <br></br>
                            Tower is {towerOpen}
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