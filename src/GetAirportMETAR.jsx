import React, { useState, useEffect } from 'react';

export default function GetAirportMETAR({airportICAO, runways}) {  
    const [metar, setMetar] = useState(undefined)
    const [hasError, setHasError] = useState(false);
    const [loading,toggleLoading] = useState(true);
    const [skyConditions,setSkyConditions] = useState(true);

    const avwxToken =  "?token=auNV6JNACu-VW3cd2FOL5OIhEzv1Q9qJxKiRQok2O7k"
    const avwxUrlCode = "https://avwx.rest/api/metar/"
    let avwxUrlCodeFetch = `${avwxUrlCode}${airportICAO}${avwxToken}`

    // console.log(avwxUrlCodeFetch)
    useEffect(()=>{
        fetch(avwxUrlCodeFetch)
        .then(response => response.json())
        .then((data) => {
            setMetar(data);
            //console.log(data)
            toggleLoading(false);   
          },
            (error)=>{
              console.log(error)
              toggleLoading(false);
              setHasError(true);
          })  
        }, [avwxUrlCodeFetch])


 
    if (loading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }

    // console.log("airport metar" ,metar)
    const airportRawMetar = metar.raw
    const airportFlightRules = metar.flight_rules 
    // eslint-disable-next-line
    let airportWindSpeed;
    // eslint-disable-next-line
    let airportWindValue = null;
    let airportWindDirection;

    //NEED HELP HANDLING ERRORS WHEN WINDS ARE NOT PRESENT

    if (metar.wind_speed.value !== null || metar.wind_speed !== null || metar.wind_speed.value !== undefined || metar.wind_speed !== undefined){
        // eslint-disable-next-line
        airportWindSpeed = metar.wind_speed.value
    }
    if (metar.wind_direction){
        airportWindValue = metar.wind_direction
    }
    if (metar.wind_direction.value){
        airportWindDirection = metar.wind_direction.value
    } 
    let airportTotalWind = 0

    if (metar.wind_gust){
        airportTotalWind = metar.wind_gust.value
        // console.log("gusts are present - use this", airportTotalWind)
    } else {
        airportTotalWind = metar.wind_speed.value
        // console.log("no gusts are present")
    }
  
   
    //filter for airport selected
    const calmWindRunway= runways.filter(function(runways) {
        return runways.CALM_WIND_RUNWAY === 'TRUE';
    })

    let runwaysToDisplay;
    let calmStatus;

    
    const calculateRunway = function(){
        var runwaysAndWinds = []
        function GetHeadingDiff(hdg1, hdg2){   
            let windDiff = (hdg1-hdg2+540) % 360 - 180;
            runwaysAndWinds.push(Math.abs(windDiff))
            
        }
        runways.forEach(function (runway) {
            const runwayHeading = runway.TRUE_HEADING
            GetHeadingDiff(airportWindDirection,runwayHeading)
            //console.log(windDiff)
            //runwaysAndWinds.push(runwayWindDiff)
        })        
        // console.log("winds array ", runwaysAndWinds)
        // console.log("runways array", runways)

      

        let minimum = Math.min(...runwaysAndWinds)
        let minIndex = runwaysAndWinds.indexOf(minimum)
        // console.log("min index is ", runways[minIndex])             
        
        runwaysToDisplay  = [runways[minIndex]]
        // console.log("in function runways to display", runwaysToDisplay)
        const runwayLength = runways.length

        addRunwayDiff(runwaysAndWinds, runwayLength)
       
    }

    const addRunwayDiff = function(runwaysAndWinds){
        // console.log("runway length" , runwayLength)
        for (var i = 0; i < runways.length; i++){
            // console.log(i)
            // console.log("runway", runways[i])
            // console.log("runways and winds", runwaysAndWinds[i])
            const target = runways[i];
            const source = {"WIND_OFFSET" : runwaysAndWinds[i]}
            Object.assign(target,source)
            //Object.assign(runways[i].push({"headingDiff" : runwaysAndWinds[i]})
        }
        // console.log("want to pass these runways to display", runways)
        return runways

    }
    calculateRunway()  

    //Show runways with less than 90 degree offset
    //filter for airport selected
    const lessThanNinety= runways.filter(function(runways) {
        return runways.WIND_OFFSET <= 90;
    })

    lessThanNinety.sort((a,b) => (a.WIND_OFFSET > b.WIND_OFFSET) ? 1 : -1)
    // console.log("less than 90 degrees", lessThanNinety)

    //Filter from less to most
    let calmWindThreshold;

    //if the airport is showing winds
    if (airportWindValue === null || airportWindValue === undefined){
        // console.log("no winds reported", airportWindValue)
        runwaysToDisplay = runways;
        // calmStatus = "no winds reported"
    } else {
        // console.log("winds are reported", airportWindValue)
        if (calmWindRunway.length > 0){ //if a calm runway exists, do these calculations and show calm wind runway
            // DO THIS IF A CALM RUNWAY EXISTS
            const calmWindThreshold = calmWindRunway[0].CALM_WIND_THRESHOLD
            // console.log("calm stats exist... calm wind threshold ",calmWindThreshold, " | airport total wind is ", airportTotalWind)
            //check to see if winds are less than the threshold
            if (airportTotalWind >= calmWindThreshold) {
                //runwaysToDisplay = runways;
                calculateRunway()
                // console.log("airport wind direction" , airportWindDirection)
                calmStatus = "(winds not calm)"
                runwaysToDisplay = lessThanNinety

            } else {
                //filter table for calm wind runways
                // console.log("display this table ",calmWindRunway)
                runwaysToDisplay = calmWindRunway  
                calmStatus = "(winds are calm)"

            }

            // console.log("runways to display ", runwaysToDisplay)

        } else { //DO THIS IF A CALM RUNWAY DOESN'T EXISTS
            // console.log("calm wind runway doesn't exist")
            // runwaysToDisplay = runways;
            // calculateRunway(airportWindDirection)
            runwaysToDisplay = lessThanNinety
            
            
        }
    }
    
    
    const checkNanWinds = function(winds){
        if ( isNaN(winds)) {
            console.log("winds don't have a value", winds)
            return 0
        } else {
            console.log("winds have a value", winds)
            return winds

        }

    }


    //MAP Runways to display
    // console.log(runwaysToDisplay)
    const runwaysPrint = runwaysToDisplay.map((runway,index) =>{
        let runwayNumber = runway.RUNWAY
        let runwayLength = runway.LENGTH_FT
        let runwayWidth = runway.WIDTH_FT
        let windOffset = runway.WIND_OFFSET
        let trafficPatternDir = runway.TRAFFIC_PATTERN

        // console.log(runway)
        return (
            <tr key={index}>
                    <td>{runwayNumber} </td>
                    <td>{runwayLength} x {runwayWidth}</td>
                    <td>{checkNanWinds(windOffset)} degrees</td>
                    <td>{trafficPatternDir}</td>
            </tr>
        )

    })

    //Exclude remarks part of the atis
    let metarToDisplay;
    const atisRemarkIndex = airportRawMetar.indexOf("RMK")
    metarToDisplay = airportRawMetar.substring(0,atisRemarkIndex)
    // console.log("airport raw metar", )

    
    const evalSkyConditions = (airportFlightRules)=>{
        if (airportFlightRules === "VFR"){
           return "skyVFR"
        }
        else if (airportFlightRules === "MVFR"){
            return "skyMVFR"
        }
        else if (airportFlightRules === "IFR"){
            return "skyIFR"
        }
    }

    return (
        <div>
             <div>
                <p className="headerText">WEATHER</p>
                {metarToDisplay}
                    <tbody>
                        <tr>
                            <td className="flightRules">Flight rules:</td>
                            <td className={evalSkyConditions(airportFlightRules)}>{airportFlightRules}</td>
                        </tr>
                    </tbody>
                
                <br></br>
                <br></br>
             
            </div>
            <div>
                <p className="headerText">PREFERRED RUNWAY(S)</p><p>{calmStatus}:</p>
                <table id="details">
                    <thead>
                        <tr>
                            <th>Runway</th>
                            <th>Length by width</th>
                            <th>Wind offset</th>
                            <th>Pattern direction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {runwaysPrint}
                    </tbody>
                </table>
             
            </div>
        </div>
       
    );
}
