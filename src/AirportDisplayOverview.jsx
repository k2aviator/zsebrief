import React, { useState, useEffect,  useContext  } from 'react';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

export default function AirportDisplayOverview({airportICAO}) {  
    const [airports, setAirports] = useState([])
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { themeName, toggleTheme } = useContext(ThemeContext)
    const buttonDark = themeName === "dark" ? 'button-dark' : '';
    
    
    //MONGO DB GET AIRPORTS
    const mongoAirportsURL = "https://zsebrief-backend-production.up.railway.app/airports"
    useEffect(()=>{
    fetch(mongoAirportsURL)
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
    }, [])

    //filter for airport selected
    const varAirportSelected = airports.filter(function(airports) {
        return airports.ICAO === airportICAO;
    })   

        
    const airportList = varAirportSelected.map((airport,index) =>{
        let airportICAO = airport.ICAO
        let airportName = airport.NAME
        let airportTowered = airport.TOWERED
        let airportHoursOpen = airport.HRS_OPEN
        let airportHoursClose = airport.HRS_CLOSE
        let airportClass = airport.AIRSPACE_CLASS
        let airportElev = airport.ELEV
        let airportNotes = decodeURIComponent(airport.NOTES)
        let airportUpdated = airport.UPDATED
        let airportUpdatedBy = airport.UPDATED_BY

        return(
            <div key={index}>
            <form>
                <label><b>{airportICAO}: {airportName}</b></label><br></br>
                <label>Last updated: {airportUpdated}</label><br></br>
                <label>Updated by: {airportUpdatedBy}</label><br></br>
                <label>Elevation: {airportElev} </label><br></br>
                <label>Airspace Class: {airportClass} </label><br></br>
                <label>Towered: {airportTowered}</label><br></br>
                <label>Hour Open: {airportHoursOpen}</label><br></br>
                <label>Hour Closed: {airportHoursClose}</label><br></br>
                <label>Notes: {airportNotes}</label><br></br>
                <br></br>
                <p></p>
            </form>
        </div>
        )

    })
       
    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }


    return (
        <div> {airportList}
        </div>
    )

}

AirportDisplayOverview.propTypes = {
}