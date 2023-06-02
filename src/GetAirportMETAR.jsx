import React, { useState, useEffect } from 'react';
import calmWindIcon from './icons/windcalm.svg'
import medWindIcon from './icons/windmed.svg'
import strongWindIcon from './icons/windstrong.svg'


export default function GetAirportMETAR({airportICAO, runways}) {  
    const [metar, setMetar] = useState(undefined)
    const [hasError, setHasError] = useState(false);
    const [loading,toggleLoading] = useState(true);

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

    //console.log("airport metar" ,metar)

    const airportRawMetar = metar.raw
    const airportFlightRules = metar.flight_rules 
    // eslint-disable-next-line
    // let airportWindSpeed;
    // eslint-disable-next-line
    let airportWindValue;
    let airportWindDirection;


    //NEED HELP HANDLING ERRORS WHEN WINDS ARE NOT PRESENT


    if (!metar.wind_direction){
        //console.log("wind direction does not exist")
        airportWindDirection = 0
    } else {
        //console.log("wind directions exists ", metar.wind_direction.value)
        airportWindDirection = metar.wind_direction.value
    }

    let airportTotalWind;

    if (!metar.wind_speed){
        //console.log("wind speed doesn't exist in metar")
        airportTotalWind = 0
    } 

    if (!metar.wind_gust){
        //console.log("wind gust doesn't exist")
        airportTotalWind = metar.wind_speed.value
    } else {
        //console.log("wind gust exists - use this value: ", metar.wind_gust.value)
        airportTotalWind = metar.wind_gust.value
    }

    //console.log("airport wind gust value ", airportTotalWind)
    airportWindValue = airportTotalWind
  
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
            //console.log("airport wind direction ", airportWindDirection)
            //console.log("runway heading ", runwayHeading)
            GetHeadingDiff(airportWindDirection,runwayHeading)
       })        
        
        let minimum = Math.min(...runwaysAndWinds)
        let minIndex = runwaysAndWinds.indexOf(minimum)
        //console.log("min index is ", minIndex)
        //console.log("filtered runways are", runways[minIndex])             
        
        runwaysToDisplay  = [runways[minIndex]]
        //console.log("in function runways to display", runwaysToDisplay)
        const runwayLength = runways.length

        addRunwayDiff(runwaysAndWinds, runwayLength)
       
    }

    const addRunwayDiff = function(runwaysAndWinds){
        //console.log("runway length" , runwayLength)
        for (var i = 0; i < runways.length; i++){
            //console.log(i)
            //console.log("runway", runways[i])
            //console.log("runways and winds", runwaysAndWinds[i])
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
    // let calmWindThreshold;

    //if the airport is showing winds
    //console.log("airport wind value is ", airportWindValue)

    if (airportWindValue === null || airportWindValue === undefined){
        //console.log("no winds reported", airportWindValue)
        runwaysToDisplay = runways;
        // calmStatus = "no winds reported"
    } else {
        //console.log("winds are reported", airportWindValue)
        if (calmWindRunway.length > 0){ //if a calm runway exists, do these calculations and show calm wind runway
            // DO THIS IF A CALM RUNWAY EXISTS
            const calmWindThreshold = calmWindRunway[0].CALM_WIND_THRESHOLD
            //console.log("calm stats exist... calm wind threshold ",calmWindThreshold, " | airport total wind is ", airportTotalWind)
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
        if (isNaN(winds)) {
             //console.log("winds don't have a value", winds)
            return 0
        } else {
             //console.log("winds have a value", winds)
            return winds

        }

    }


    //MAP Runways to display
    //console.log("runways to display" , runwaysToDisplay)
    const runwaysPrint = runwaysToDisplay.map((runway,index) =>{
        let runwayNumber = runway.RUNWAY
        let runwayLength = runway.LENGTH_FT
        let runwayWidth = runway.WIDTH_FT
        let windOffset = runway.WIND_OFFSET
        let trafficPatternDir = runway.TRAFFIC_PATTERN

        //console.log("runway number", runwayNumber)
        //console.log("wind offset" , windOffset)
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

    const setWindSock = (winds)=>{
        if (winds <= 5){
            return calmWindIcon
            
        } else if (winds <= 15){
            return medWindIcon 

        } else {
            return strongWindIcon
        }
    }

    return (
        <div>
             <div>
                <p className="headerText">WEATHER</p>
                <p>{metarToDisplay}</p>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="flightRules">Flight rules:</td>
                            <td className={evalSkyConditions(airportFlightRules)}>{airportFlightRules}</td>
                        </tr>
                        </tbody>
                    </table>
             
            </div>
            <div>
                <span className="headerText">PREFERRED RUNWAY(S)</span><span className="windsNotCalm">{calmStatus}</span> <img alt="wind sock" className="iconWindSock" src={setWindSock(airportTotalWind)}></img>
                <p></p>
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
