import React, { useState } from 'react';
import GetAirportRunways from './GetAirportRunways'
import GetAirportDepartures from './GetAirportDepartures'
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
        // console.log(airportICAO, airportTowered, airportHoursOpen)
        isTowerOpen()
        if( airportTowered === "TRUE"){
            setAirportOpen(!airportOpen)
    
        }
    }

    const isTowerOpen = ()=>{
        if (airportHoursOpen === 2359){
            setTowerOpen("TWR OPEN")
        }
        else if (parseInt(pstTime) > airportHoursOpen) {
            if (parseInt(pstTime) < airportHoursClose){
                // console.log(airportICAO, "OPEN")
                // console.log("time now is ", pstTime)
                // console.log("airport opens at ", airportHoursOpen, " and closes at", airportHoursClose)
                setTowerOpen("TWR OPEN")
            } else {
                // console.log(airportICAO, "CLOSED")
                // console.log("time now is ", pstTime)
                // console.log("airport opens at ", airportHoursOpen, " and closes at", airportHoursClose)
                setTowerOpen("TWR CLOSED")
            }
        }
    }

    const displayHours = (hours) =>{
        hours = hours.toString()
        // console.log(hours)
        // console.log("function hours ", hours)
        if (hours.length === 3 ){
            // console.log("airport hours length ", hours.length)
            return `0${hours}`
        } else {
            // console.log("airport hours length ", hours.length)
            return hours
        }
    }

    // console.log("airport open hours", airportHoursOpen)
    // console.log("pst time ", parseInt(pstTime))

    const setTowerStatus = (towerOpen)=>{
        if (towerOpen === "TWR OPEN"){
            return "towerOpen"
        } else {
            return "towerClosed"
        }
    }


    const roundElevation = (number)=>{
        return Math.ceil(number /100) * 100 + 1000;


    }


    return (
        <div className="airport-details-box">
            <div className="airport-code-name" onClick={()=>toggleOpen()}>
                <div id="airportName" >
                    <button className="button">{airportICAO} | {airportName} </button>
                    {open && <div className="collapsible-expand">
                            
                        {airportOpen &&  
                        <div> 
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={setTowerStatus(towerOpen)}>{towerOpen}</td>
                                    <td>{displayHours(airportHoursOpen)}-{airportHoursClose} (time now {pstTime})</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        }

                        <div> 
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Airspace:</td>
                                        <td>{airspaceClass}</td>
                                    </tr>
                                    <tr>
                                        <td>Elev:</td>
                                        <td>{airportElev}</td>
                                    </tr>
                                    <tr>
                                        <td>Pattern Alt:</td>
                                        <td>{roundElevation(airportElev)} (turbine: {roundElevation(airportElev)+500})</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
           
                            <GetAirportRunways airportICAO={airportICAO}/>
                            <p></p>
                            <GetAirportDepartures airportICAO={airportICAO}/>
                            <p></p>
                        <div>
                            <Link to="/airportedit" state={{airportICAO}}> <button>All Rwy Details</button></Link>
                        </div>
                    </div>}
                </div> 
            </div>
        </div>
    )

}

GetAirportDetails.propTypes = {
}