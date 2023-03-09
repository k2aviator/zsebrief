import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, } from "firebase/database";
import GetAirportDetails from './GetAirportDetails'

export default function GetAirportList({pstTime}) {  
   
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [airports, setAirports] = useState([])

    useEffect(()=>{
    
        const db = getDatabase();
        const airportsdb = ref(db,'airports/');
        
        get(airportsdb).then((snapshot) => {
            // console.log(snapshot.val());
            setIsLoading(false);
                if(snapshot.exists()){
                    // console.log("data exists")
                    setAirports(snapshot.val())
                } else {
                    // console.log("no data exists")
                    setHasError(true)
                }         
            }).then(
                // console.log(airports)
            )
        }, [])

    // MAP AIRPORTS TO AIRPORT LIST
    const airportList = airports.map((airport,index) =>{
        let airportICAO = airport.ICAO
        let airportName = airport.NAME
        let airportTowered = airport.TOWERED
        let airportHoursOpen = airport.HRS_OPEN
        let airportHoursClose = airport.HRS_CLOSE
        let airspaceClass = airport.AIRSPACE_CLASS
        let airportElev = airport.ELEV

        //console.log("code is", airportICAO)
        
        // <div className={airportOpen? "" : "content"}>Airport: {airportName}</div>
        return (
            <div key={index}>
            <GetAirportDetails airportICAO={airportICAO} airportName={airportName} airportTowered={airportTowered} airportHoursOpen={airportHoursOpen} airportHoursClose={airportHoursClose} airspaceClass={airspaceClass} airportElev={airportElev} pstTime={pstTime}/>
            </div>
        )
    })

    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }

    const toggleCollapseAll = () =>{
        const allExpandedElements = document.querySelectorAll("div.collapsible-expand")
        allExpandedElements.forEach((element) => {
            element.className = "collapsible-hidden";
        });
    
        // console.log(airportICAO, airportTowered, airportHoursOpen)
        // if( airportTowered === "TRUE"){
        //     setAirportOpen(!airportOpen)
        // }
    }

    return (

        <div className="airport-details">
            <div className="airport-details-collapse-button">
                <button className="button-collapse-all" onClick={toggleCollapseAll}>Collapse all</button>
            </div>
            <div>
                {airportList}
            </div>
        </div>
    );
}
