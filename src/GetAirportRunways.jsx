import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import GetAirportMETAR from './GetAirportMETAR'


export default function GetAirportRunways({airportICAO}) {  
    
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [runways, setRunways] = useState([]);

    useEffect(()=>{
    
        const db = getDatabase();
        const runwaysdb = ref(db,'runways/');
     

        get(runwaysdb).then((snapshot) => {
            //console.log(snapshot.val());
            setIsLoading(false);
                if(snapshot.exists()){
                    // console.log("data exists")
                    setRunways(snapshot.val())
                } else {
                    // console.log("no data exists")
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
        let runwayODP = runway.ODP

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
            <p className="headerText">ALL RUNWAYS</p>
            <table id="details">
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
