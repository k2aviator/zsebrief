import React, { useState, useEffect, useContext } from 'react';
import MobileGetAirportDetails from './MobileGetAirportDetails'
import PropTypes from 'prop-types';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

export default function MobileGetAirportList({pstTime}) {  
   
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [airports, setAirports] = useState([])
    const { themeName, toggleTheme } = useContext(ThemeContext)


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
    

    const airportsSorted = airports.sort((a, b) => a.ICAO.localeCompare(b.ICAO));
    // MAP AIRPORTS TO AIRPORT LIST
    const airportList = airportsSorted.map((airport,index) =>{
        let airportICAO = airport.ICAO
        let airportName = airport.NAME
        let airportTowered = airport.TOWERED
        let airportHoursOpen = airport.HRS_OPEN
        let airportHoursClose = airport.HRS_CLOSE
        let airspaceClass = airport.AIRSPACE_CLASS
        let airportElev = airport.ELEV

        return (
            <div key={index}>
            <MobileGetAirportDetails airportICAO={airportICAO} airportName={airportName} airportTowered={airportTowered} airportHoursOpen={airportHoursOpen} airportHoursClose={airportHoursClose} airspaceClass={airspaceClass} airportElev={airportElev} pstTime={pstTime}/>
            </div>
        )
    })

    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }

    // const toggleCollapseAll = () =>{
    //     console.log("function")
    //     const allExpandedElements = document.querySelectorAll("div[class^='collapsible-expand']");
    //     console.log("all expanded elements are ", allExpandedElements)
    //     allExpandedElements.forEach((element) => {
    //         element.classList.add("hidden");
    //     });

    // }

    return (

        <div>
            {/* <div className="airport-details-collapse-button">
                <button className={`button-collapse-all-${themeName}`} onClick={toggleCollapseAll}>Collapse all</button>
            </div> */}
            <div className="airport-details-container">
                {airportList}
            </div>
        </div>
    );
}
