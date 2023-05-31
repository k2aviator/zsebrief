import React, { useState, useEffect } from 'react';

export default function GetAllAirportRunways({airportICAO}) {  
            
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [runways, setRunways] = useState([])

     //MONGO DB GET RUNWAYS

    //const mongoAirportToken =  "?token=auNV6JNACu-VW3cd2FOL5OIhEzv1Q9qJxKiRQok2O7k"
    const mongoRunwaysURL = "https://zsebrief-backend-production.up.railway.app/runways"
    // let mongoUrlFetch = `${mongoAirportURL}${mongoAirportToken}`

    useEffect(()=>{
        fetch(mongoRunwaysURL)
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
        }, [mongoRunwaysURL])
    
    //Write to database

    // for (const [index, value] of runways.entries()){
    //     // console.log(index,value)
    //     const target = value;
    //     // console.log("target", target)
    //     const source = {"INDEX" : index}
    //     Object.assign(target,source)
    // }


    const varAirportSelected = runways.filter(function(runways, index) {
        runways.index = index
        return runways.ICAO === airportICAO;
    })
    
    //MAP Airport Runways

    console.log(varAirportSelected)

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
        let runwayIndex = runway.INDEX

        // const runwayLengthTest = 69;

        return (
            <div key={index}>
                <form>
                    <label><b>Runway {runwayNumber} | Index # {runwayIndex}</b></label><br></br>
                    <label>Last updated {runwayUpdated}</label><br></br>
                    <label>Calm Wind Runway? Currently is set to {runwayCalmWind}: </label><br></br>
                    <input type = "radio" id="calmWind" name="calmWindSelector" value="TRUE"></input>
                    <label htmlFor="True">True</label>
                    <input type = "radio" id="calmWind" name="calmWindSelector" value="FALSE"></input>
                    <label htmlFor="True">False</label>  
                    <br></br>
                    <label>Calm threshold: </label><input type="text" id="runwayCalmThreshold" size="1" placeholder={runwayCalmWindThreshold} /><br></br>
                    <label>DVA: </label><input type="text" id="runwayDva" size="50" placeholder={runwayDVA} /><br></br>
                    <label>ODP: </label><input type="text" id="runwayODP" size="50" placeholder={runwayODP} /><br></br>
                    <label>IAP: </label><input type="text" id="runwayIap" size="1" placeholder={runwayIAP} /><br></br>
                    <label>Length (FT): </label><input type="text" id="runwayLength" size="2" placeholder={runwayLength} /><br></br>
                    <label>Width (FT): </label><input type="text" id="runwayWidth" size="1" placeholder={runwayWidth} /><br></br>
                    <label>HDG (Mag): </label><input type="text" id="runwayMagHeading" size="1" placeholder={runwayMagHeading} /><br></br>
                    <label>HDG (True): </label><input type="text" id="runwayTrueHeading" size="1" placeholder={runwayTrueHeading} /><br></br>
                    <label>Traffic pattern? Currently is set to {runwayPatternDirection}: </label><br></br>
                    <input type = "radio" id="trafficDirection" name="trafficDirection" value="LEFT"></input>
                    <label htmlFor="LEFT">Left</label>
                    <input type = "radio" id="trafficDirection" name="trafficDirection" value="RIGHT"></input>
                    <label htmlFor="RIGHT">Right</label> 
                    <br></br>
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