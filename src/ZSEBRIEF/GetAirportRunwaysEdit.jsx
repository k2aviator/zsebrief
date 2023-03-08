import React, { useState, useEffect } from 'react';
import { getDatabase, onValue, doc, getDocs, onSnapshot, ref, child, get, set } from "firebase/database";
import GetAirportMETAR from './GetAirportMETAR'


export default function GetAllAirportRunways({airportICAO}) {  
    

 
        
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
        return runways.ICAO == airportICAO;
    })
    
    //MAP Airport Runways
    const runwaysList = varAirportSelected.map((runway,index) =>{
        let runwayCalmWind = runway.CALM_WIND_RUNWAY
        let runwayCalmWindThreshold = runway.CALM_WIND_THRESHOLD
        let runwayDVA = runway.DVA
        let runwayIAP = runway.IAP
        let runwayLength = runway.LENGTH_FT
        let runwayMagHeading = runway.MAG_HEADING
        let runwayODP = runway.ODP
        let runwayNumber = runway.RUNWAY
        let runwayPatternDirection = runway.TRAFFIC_PATTERN
        let runwayTrueHeading = runway.TRUE_HEADING
        let runwayUpdated = runway.UPDATED
        let runwayWidth = runway.WIDTH_FT


        const calmWindOptions = [
            { value: "TRUE" , label: "TRUE"},
            { value: "FALSE", label: "FALSE"}
        ]

        const calmWindIndex = calmWindOptions.findIndex(i => i.value === runwayCalmWind)
    
        console.log("index" , calmWindIndex)
        // <select id="calmWindRunway" name="calmWindRunway">
        // <option value="TRUE">TRUE</option>
        // <option value="FALSE">FALSE</option>
        // </select>

        return (
            <div key={index}>
                <form>
                    <label><b>Runway {runwayNumber}</b></label><br></br>
                    <label>Last updated {runwayUpdated}</label><br></br>
                    <label>Calm Wind Runway? Currently is set to {runwayCalmWind}: </label>
                    <select>
                        {calmWindOptions.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <br></br>
                    <label>Calm threshold: </label><input type="text" id="runwayCalmThreshold" size="1" placeholder={runwayCalmWindThreshold} /><br></br>
                    <label>DVA: </label><input type="text" id="runwayDva" size="50" placeholder={runwayDVA} /><br></br>
                    <label>ODP: </label><input type="text" id="runwayODP" size="50" placeholder={runwayODP} /><br></br>
                    <label>IAP: </label><input type="text" id="runwayIap" size="1" placeholder={runwayIAP} /><br></br>
                    <label>Length (FT): </label><input type="text" id="runwayLength" size="2" placeholder={runwayLength} /><br></br>
                    <label>Width (FT): </label><input type="text" id="runwayWidth" size="1" placeholder={runwayWidth} /><br></br>
                    <label>HDG (Mag): </label><input type="text" id="runwayMagHeading" size="1" placeholder={runwayMagHeading} /><br></br>
                    <label>HDG (True): </label><input type="text" id="runwayTrueHeading" size="1" placeholder={runwayTrueHeading} /><br></br>
                    <label>Traffic pattern? Currently is set to {runwayPatternDirection}: </label>
                        <select id="runwayPatternDirection" name="runwayPatternDirection">
                            <option value="LEFT">LEFT</option>
                            <option value="RIGHT">RIGHT</option>
                        </select>
                    <br></br>
                    <input type="submit" value="Submit" />
                    <p></p>
                </form>
            </div>
        )
    })

    // console.log("airport selected", varAirportSelected)

    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }

    return (
        <div>
            {runwaysList}
        </div>
    );
}
