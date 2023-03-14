import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { useLocation } from 'react-router-dom'
import firebase from 'firebase/compat/app'
import { getDatabase, ref, get, } from "firebase/database";
import Login from './Login'


const vatsimURL = `https://data.vatsim.net/v3/vatsim-data.json`
const vatusaURL = `https://api.vatusa.net/v2/public/planes`

export default function NearbyAirplanes(){

    const [airports, setAirports] = useState([])
    const [user, setUser] = useState({})
    const [hasError, setHasError] = useState(false);
    const [loading,toggleLoading] = useState(true);
    const [airplanes, setAirplanes] = useState(undefined)
    const [pilotsInRange, setPilotsInRange] = useState(undefined)
    const [displayPilots,setDisplayPilots] = useState(undefined)
   
    useEffect(()=>{
    
        const db = getDatabase();
        const airportsdb = ref(db,'airports/');
        
        get(airportsdb).then((snapshot) => {
            // console.log(snapshot.val());
            toggleLoading(false);
                if(snapshot.exists()){
                    // console.log("data exists")
                    setAirports(snapshot.val())
                } else {
                    // console.log("no data exists")
                    setHasError(true)
                }         
            })
        }, [])
    
    //CENTRAL LOCATION FOR FILTERING (UKIAH, OREGON)
    const centerLat = 45.133690
    const centerLong = -118.931670
    const centerRadius = 350

        
    const getDistanceFromAirport = async function (airplanes){ //loops through all VATSIM planes to calculate distance from central location and adds DIST_ZSE
        console.log("Function #1 - Get all airplane distances from center point")
        console.log("distance from airport function", airplanes)
        for (var i = 0; i < airplanes.length; i++){
            let airplaneLatitude = airplanes[i].latitude
            let airplaneLongitude = airplanes[i].longitude
            let distanceTable = ""
            distanceTable = distance(centerLat,centerLong,airplaneLatitude,airplaneLongitude,"N")
            const target = airplanes[i];  
            // console.log("distance", distanceTable)          
            const source = {"DIST_ZSE" : distanceTable}
            Object.assign(target,source)
        }
    }


    const buildPilotsInRange = async function() {
        console.log("Function #2 - Build pilots in range")
        //filter data for pilots in range
        let pilotsInRange = airplanes.filter(item => item.DIST_ZSE <= 350 && item.groundspeed <= 80)
        // //calculate distance to closest airport
        // console.log("Function #2 - Pilots table in range ",  pilotsInRange)
       setPilotsInRange(pilotsInRange)
       return pilotsInRange
    }

    const runUpdate = async function (airplanes){
        console.log("Initialize run update async function")
        var awaitGetDistanceFromAirport = await(getDistanceFromAirport(airplanes)) //function number 1
        var awaitBuildPilotsInRange = await(buildPilotsInRange(awaitGetDistanceFromAirport)) //function number 2
        var awaitGetClosestAirport = await(getClosestAirport(awaitBuildPilotsInRange)) //function number 3
        await updatePage(awaitGetClosestAirport)
        console.log("all work done")
    }
   
    const getClosestAirport = async function (pilotsInRange){
        console.log("Function #3 - Get closest airports for pilots in range")
        let airportList = airports
        // console.log("airports loop", airportList)
        console.log(pilotsInRange)
        console.log("number of planes to process ", pilotsInRange.length, pilotsInRange)
        for (var i = 0; i < airportList.length; i++ ){
            // console.log(airportList[i])
            let airportCode = airportList[i].ICAO 
            let airportLat = parseFloat(airportList[i].LAT) 
            let airportLong = parseFloat(airportList[i].LONG)
            // console.log(airportList[i])
            console.log(airportCode, airportLat, airportLong)
            // console.log(`checking ${airportCode} airport`)
            for (var b = 0; b < pilotsInRange.length; b++){
                let airplaneLatitude = pilotsInRange[b].latitude
                let airplaneLongitude = pilotsInRange[b].longitude
                let distanceAirplaneAirport = ""
                // console.log("aiport calculations ", airportLat, airportLong)
                // console.log("airplane calculations ", airplaneLatitude, airplaneLongitude)
                distanceAirplaneAirport = distance(airportLat, airportLong,airplaneLatitude,airplaneLongitude,"N")
                // console.log("aiport calculations ", airportLat, airportLong)
                // console.log("airplane calculations ", airplaneLatitude, airplaneLongitude)
                console.log("pilots in range", pilotsInRange[b])
                console.log("distance", distanceAirplaneAirport)  
                if (distanceAirplaneAirport <= 3){ //within 3 miles of an airport
                    // console.log(`${pilotsInRange[b].callsign} within 3 miles of ${airportCode} an airport: distance is ${distanceAirplaneAirport}`)
                    // // if departing or arriving
                    let airplaneOrigin;
                    let airplaneArrival;
                    const target = pilotsInRange[b];
                    const sourceClosest = {"CLOSEST" : `${airportCode}`}
                    Object.assign(target,sourceClosest)
                    if (pilotsInRange[b].flight_plan === null || pilotsInRange[b].flight_plan === undefined) {
                        airplaneOrigin = "NONE" 
                        airplaneArrival = "NONE" 
                        const target = pilotsInRange[b];  
                        const sourceDeparture = {"STATUS" : "NO FLIGHTPLAN"}
                        Object.assign(target,sourceDeparture)
                    } else {
                        airplaneOrigin = pilotsInRange[b].flight_plan.departure
                        airplaneArrival = pilotsInRange[b].flight_plan.arrival
                        const target = pilotsInRange[b];  
                        const sourceClosest = {"CLOSEST" : `${airportCode}`}
                        if (airplaneArrival === airportCode && airplaneOrigin === airportCode ){
                            const sourceArrival = {"STATUS" : "PATTERN WORK"}
                            Object.assign(target,sourceArrival)
                        } else if (airplaneArrival === airportCode){  
                            const sourceArrival = {"STATUS" : "ARRIVED"}
                            Object.assign(target,sourceArrival)
                     
                        } else {
                            const sourceDeparture = {"STATUS" : "DEPARTING"}
                            Object.assign(target,sourceDeparture)
                            
                        }
                     }
                   
                } else { //not within 3 miles of an airport  
                    // console.log(`${pilotsInRange[b].callsign} not within 3 miles of ${airportCode} an airport: distance is ${distanceAirplaneAirport}`)
                    const source = {"CLOSEST" : "NA"}
                    const target = pilotsInRange[i];  
                    Object.assign(target,source)
                }   
                //
            }
        }
    }
   
    // CREATE TABLES BASED ON STATUS
    let pilotsInRangeDisplay;

    const updatePage = async function (){
        console.log("pilots in range for if statement", pilotsInRange)
        if (pilotsInRange === null || pilotsInRange === undefined) {
            pilotsInRangeDisplay = null
            console.log("skip")
        } else {
            console.log("display pilots ", pilotsInRange)
            pilotsInRangeDisplay = pilotsInRange.map((airplane,index) =>{
                let airplaneCallsign = airplane.callsign
                let airplaneGroundSpeed = airplane.groundspeed
                let airplaneLatitude = airplane.latitude
                let airplaneLongitude = airplane.longitude
                let airportClosest = airplane.CLOSEST
                let airplaneStatus = airplane.STATUS
                // console.log("airplane", airplane.callsign)
                let airplaneOrigin;
                let airplaneArrival;
                if (airplane.flight_plan === null | airplane.flight_plan === undefined) {
                    airplaneOrigin = "NONE" 
                    airplaneArrival = "NONE" 
                    return (           
                        <tr key={index}>
                            <td>{airplaneCallsign}
                            </td>
                            <td>{airplaneLatitude}
                            </td>
                            <td>{airplaneLongitude}
                            </td>
                            <td>{airplaneGroundSpeed}
                            </td>
                            <td>{airplaneOrigin}
                            </td>
                            <td>{airplaneArrival}
                            </td>
                            <td>{airportClosest}
                            </td>
                            <td>{airplaneStatus}
                            </td>
                        </tr>
                        )
                } else {
                    airplaneOrigin = airplane.flight_plan.departure
                    airplaneArrival = airplane.flight_plan.arrival
                    return (           
                        <tr key={index}>
                            <td>{airplaneCallsign}
                            </td>
                            <td>{airplaneLatitude}
                            </td>
                            <td>{airplaneLongitude}
                            </td>
                            <td>{airplaneGroundSpeed}
                            </td>
                            <td>{airplaneOrigin}
                            </td>
                            <td>{airplaneArrival}
                            </td>
                            <td>{airportClosest}
                            </td>
                            <td>{airplaneStatus}
                            </td>
                            </tr>
                            )
                    }
                })
            }
    }
    
    // console.log("pilots in range display", pilotsInRangeDisplay)

    // if (airplanes === null || airplanes === undefined) {
    //     console.log("no data", airplanes)
    // } else {
    //     if (pilotsInRange === null || pilotsInRange === undefined) {
    //         //  console.log("no pilots in range data", pilotsInRange)     
    //          runUpdate(airplanes)    
    //     } else {
            
    //     }    
    // }
    
    
   
   
    const callVatsim = ()=> {
        console.log("calling vatsim")
        fetch(vatsimURL,{
        method : "GET",
        })
        .then(response => response.json())
        .then((data) => {
            // console.log("request data", data.pilots)
            toggleLoading(false);  
            setAirplanes(data.pilots)
            },
            (error)=>{
                console.log(error)
                toggleLoading(false);
                setHasError(true);
            })
        .then(runUpdate())  
        }
  

    useEffect(()=>{
        const fetchVatsim = setInterval(() => 
        callVatsim(),10000);
        return () => {
            clearInterval(fetchVatsim);
          };
    }, [])
            
    

    // let airportsLookUp = airports.map(item => item.ICAO)
   //  console.log(airportsLookUp)



    function distance(lat1, lon1, lat2, lon2, unit) {
        //'M' is statute miles (default)
        //'K' is kilometers
        //'N' is nautical miles 
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return Math.round(dist);
        }
    }


    //TWO TABLE BELOW

    //Origin is within airport table and speed matches criteria

    //Origin is NA and speed matches criteria
    

    // if (loading) {
    //     return <p>loading...</p>
    // }

    // if (hasError) {
    //     return <p>Has error!</p>
    // }
    //{airplaneList}

    if (user){
    return(
        <div className="body">
            <Nav />
            <h3>Nearby airplanes</h3>
            <h3>Nearby - no flightplan</h3>
            <table>
                    <thead>
                        <tr>
                            <th>Callsign                              
                            </th>
                            <th>Lat.
                            </th>
                            <th>Long.
                            </th>
                            <th>GS
                            </th>
                            <th>Origin
                            </th>
                            <th>Dest.
                            </th>
                            <th>Closest
                            </th>
                            <th>Status
                            </th>
                        </tr>   
                    </thead>
                     {pilotsInRange &&
                        <tbody>
                            {pilotsInRangeDisplay}
                        </tbody>}
                    
            </table>
        </div>
      
    )
    } else {
        return(
            <Login />
        )
    }

}
