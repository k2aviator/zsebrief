import React, { useState, useEffect } from 'react';
import GetAirportDetails from './GetAirportDetails'

export default function GetAirportList({pstTime}) {  
   
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [airports, setAirports] = useState([])

    //MONGO DB GET AIRPORTS

    //const mongoAirportToken =  "?token=auNV6JNACu-VW3cd2FOL5OIhEzv1Q9qJxKiRQok2O7k"
    const mongoAirportURL = "https://zsebrief-backend-production.up.railway.app/airports"
    // let mongoUrlFetch = `${mongoAirportURL}${mongoAirportToken}`

    useEffect(()=>{
        fetch(mongoAirportURL)
        .then(response => response.json())
        .then((data) => {
            setAirports(data);
            setIsLoading(false);   
            },
            (error)=>{
                console.log(error)
                setIsLoading(false);
                setHasError(true);
            })  
        }, [mongoAirportURL])
    

    // MAP AIRPORTS TO AIRPORT LIST
    const airportList = airports.map((airport,index) =>{
        let airportICAO = airport.ICAO
        let airportName = airport.NAME
        let airportTowered = airport.TOWERED
        let airportHoursOpen = airport.HRS_OPEN
        let airportHoursClose = airport.HRS_CLOSE
        let airspaceClass = airport.AIRSPACE_CLASS
        let airportElev = airport.ELEV

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

    }

    return (

        <div className="airport-details">
            <div className="airport-details-collapse-button">
                <button className="button-collapse-all" onClick={toggleCollapseAll}>Collapse all</button>
            </div>
            <div className="airport-details-container">
                {airportList}
            </div>
        </div>
    );
}
