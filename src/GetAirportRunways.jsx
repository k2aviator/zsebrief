import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import GetAirportMETAR from './GetAirportMETAR'

export default function GetAirportRunways({airportICAO}) {  
    
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [runways, setRunways] = useState([])
    
    useEffect(()=>{
    
        const db = getDatabase();
        const runwaysdb = ref(db,'runways/');
     

        get(runwaysdb).then((snapshot) => {
            //console.log(snapshot.val());
            setIsLoading(false);
                if(snapshot.exists()){
                    console.log("data exists")
                    setRunways(snapshot.val())
                } else {
                    console.log("no data exists")
                    setHasError(true)
                }         
            }).then(
            )
        }, [])

    //filter for airport selected
    const varAirportSelected = runways.filter(function(runways) {
        return runways.ICAO === airportICAO;
    })
    // console.log("airport selected", varAirportSelected)


    //MAP Airport Runways
    const runwaysList = varAirportSelected.map((runway,index) =>{
        let runwayNumber = runway.RUNWAY
        let runwayCalmWind = runway.CALM_WIND_RUNWAY
        let runwayCalmWindThreshold = runway.CALM_WIND_THRESHOLD

        //console.log("code is", airportICAO)
        
        // <div className={airportOpen? "" : "content"}>Airport: {airportName}</div>
        return (
            <div key={index}>
                Runway: {runwayNumber} | Calm wind? {runwayCalmWind} | Threshold {runwayCalmWindThreshold} | Length by width: {runway.LENGTH_FT} x {runway.WIDTH_FT}
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
        <div>
            <div>
            <GetAirportMETAR airportICAO={airportICAO} runways={varAirportSelected}/>
            </div>
            <div>
            <p>Airport runways:</p>
            {runwaysList}
            </div>
         </div>
    );
}
