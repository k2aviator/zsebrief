import React, { useState, useEffect, useContext } from 'react';
import GetAirportMETAR from './GetAirportMETAR'
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'


export default function GetAirportRunways({airportICAO}) {  
    
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [runways, setRunways] = useState([]);
    const { themeName, toggleTheme } = useContext(ThemeContext)

    //MONGO DB GET RUNWAYS

    //const mongoAirportToken =  "?token=auNV6JNACu-VW3cd2FOL5OIhEzv1Q9qJxKiRQok2O7k"
    const mongoRunwayURL = "https://zsebrief-backend-production.up.railway.app/runways"
    // let mongoUrlFetch = `${mongoAirportURL}${mongoAirportToken}`

    useEffect(()=>{
        fetch(mongoRunwayURL)
        .then(response => response.json())
        .then((data) => {
            setRunways(data);
            setIsLoading(false);   
            },
            (error)=>{
                console.log(error)
                setIsLoading(false);
                setHasError(true);
            })  
        }, [mongoRunwayURL])
    




    //filter for airport selected
    const varAirportSelected = runways.filter(function(runways) {
        return runways.ICAO === airportICAO;
    })
    // console.log("airport selected", varAirportSelected)



    //Show calm wind details

    const showCalmDetails = (runwayCalmWind,runwayCalmWindThreshold) => {
        let calmDetails = "";
        //console.log("runway calm wind ", runwayCalmWind)
        if (runwayCalmWind === "TRUE"){
            calmDetails = `YES: ${runwayCalmWindThreshold} KTS`
            //console.log("yes, calm ", runwayCalmWind, runwayCalmWindThreshold)
            return calmDetails
        } else {
            //console.log("no, not calm ", runwayCalmWind, runwayCalmWindThreshold)
            calmDetails = ""
            return calmDetails
        }
    }


    //MAP Airport Runways
    const runwaysList = varAirportSelected.map((runway,index) =>{
        let runwayNumber = runway.RUNWAY
        let runwayCalmWind = runway.CALM_WIND_RUNWAY
        let runwayCalmWindThreshold = runway.CALM_WIND_THRESHOLD
        let runwayODP = decodeURIComponent(runway.ODP)

        return (
            <tr key={index}>
                    <td>{runwayNumber}</td>
                    <td>{runway.LENGTH_FT} x {runway.WIDTH_FT}</td>
                    <td>{showCalmDetails(runwayCalmWind, runwayCalmWindThreshold)}</td>
                    <td>{runwayODP}</td>
            </tr>
        )
    })


    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }


    return (
        <div>
            <div>
            <GetAirportMETAR airportICAO={airportICAO} runways={varAirportSelected} />
           
            </div>
            <div>
            <p className={`headerText-${themeName}`}>ALL RUNWAYS</p>
            <table className={`details-${themeName}`}>
                <thead>
                    <tr>
                        <th>Runway</th>
                        <th>Length by width</th>
                        <th>Calm wind runway</th>
                        <th>ODP (if available)</th>
                    </tr>
                </thead>
                <tbody>
                     {runwaysList}
                </tbody>
            </table>
         
            </div>
         </div>
    );
}
