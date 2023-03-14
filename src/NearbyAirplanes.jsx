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
    const [displayMajors,setDisplayMajors] = useState(undefined)

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


    const getDistanceFromAirport = async function (){ //loops through all VATSIM planes to calculate distance from central location and adds DIST_ZSE
        console.log("Function #1 - Get all airplane distances from center point")
        // console.log("distance from airport function", airplanes)
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
        console.log("Function #2 - Pilots table in range ",  pilotsInRange)
        setPilotsInRange(pilotsInRange)
       return pilotsInRange
    }

   
    const getClosestAirport = async function (){
        console.log("Function #3 - Get closest airports for pilots in range")
        let airportList = airports
        // console.log("airports loop", airportList)
        // console.log(pilotsInRange)
        // console.log("number of planes to process ", pilotsInRange.length, pilotsInRange)
        // console.log(airportList.length)
        for (var i = 0; i < airportList.length; i++ ){
            // console.log(airportList[i])
            let airportCode = airportList[i].ICAO 
            let airportLat = parseFloat(airportList[i].LAT) 
            let airportLong = parseFloat(airportList[i].LONG)
            // console.log(airportList[i])
            // console.log(airportCode, airportLat, airportLong)
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
                //console.log("pilots in range", pilotsInRange[b])
                // console.log("distance", distanceAirplaneAirport)  
                const target = pilotsInRange[b]; 
                const sourceClosest = {"CLOSEST" : `${airportCode}`}
                if (distanceAirplaneAirport <= 3){ //within 3 miles of an airport
                    // console.log(`${pilotsInRange[b].callsign} within 3 miles of ${airportCode} an airport: distance is ${distanceAirplaneAirport}`)
                    // if departing or arriving
                    let airplaneOrigin;
                    let airplaneArrival;
                    const target = pilotsInRange[b];  
                    if (pilotsInRange[b].flight_plan === null || pilotsInRange[b].flight_plan === undefined) {
                        airplaneOrigin = "NONE" 
                        airplaneArrival = "NONE" 
                        const target = pilotsInRange[b];  
                        Object.assign(target,sourceClosest)
                    } else {
                        airplaneOrigin = pilotsInRange[b].flight_plan.departure
                        airplaneArrival = pilotsInRange[b].flight_plan.arrival
                        if (airplaneArrival === airportCode && airplaneOrigin === airportCode ){
                            const target = pilotsInRange[b]; 
                            // const sourceArrival = {"STATUS" : "PATTERN WORK"}
                            // Object.assign(target,sourceArrival)
                            Object.assign(target,sourceClosest)
                        } else if (airplaneArrival === airportCode){  
                            const target = pilotsInRange[b]; 
                            const sourceArrival = {"STATUS" : "ARRIVED"}
                            // const sourceClosest = {"CLOSEST" : `${airportCode}`}
                            // Object.assign(target,sourceArrival)
                            Object.assign(target,sourceClosest)
                     
                        } else {
                            const target = pilotsInRange[b]; 
                            const sourceDeparture = {"STATUS" : "DEPARTING"}
                            // const sourceClosest = {"CLOSEST" : `${airportCode}`}
                            // Object.assign(target,sourceDeparture)
                            Object.assign(target,sourceClosest)
                            
                        }
                     }
                   
                } else { //not within 3 miles of an airport  
                    // console.log(`${pilotsInRange[b].callsign} not within 3 miles of ${airportCode} an airport: distance is ${distanceAirplaneAirport}`)
                    // const sourceClosest = {"CLOSEST" : "NA"}
                    // Object.assign(target,sourceClosest)
                }   
            
            }
            
        }
        console.log("output for function Get closest airports for pilots in range")
        // setDisplayPilots(pilotsInRange)
    }


    const getFlightStatus = async function (){
        console.log("Function #4: Get flight status")
        for (var c = 0; c < pilotsInRange.length; c++){
        // console.log(pilotsInRange[c])
        let airplaneOrigin;
        let airplaneArrival;
        const target = pilotsInRange[c]
            if (pilotsInRange[c].flight_plan === undefined || pilotsInRange[c].flight_plan === null) { 
                // console.log("no flightplan")
                // console.log(pilotsInRange[c].flight_plan)
                const sourceNoFlightPlan = {"STATUS" : "NO FLIGHTPLAN"}
                Object.assign(target,sourceNoFlightPlan)
            } else {
                // console.log("there is a flightplan")
                // console.log(pilotsInRange[c].flight_plan)
                airplaneOrigin = pilotsInRange[c].flight_plan.departure
                airplaneArrival = pilotsInRange[c].flight_plan.arrival
                let airplaneClosest = pilotsInRange[c].CLOSEST
                // console.log(airplaneClosest, airplaneOrigin, airplaneArrival)
                if (airplaneArrival === airplaneClosest){
                    // const target = pilotsInRange[c]; 
                    const sourceArrival = {"STATUS" : "ARRIVED"}
                    // const sourceClosest = {"CLOSEST" : `${airportCode}`}
                    // Object.assign(target,sourceArrival)
                    Object.assign(target,sourceArrival)
                }
                if (airplaneOrigin === airplaneClosest){
                    // const target = pilotsInRange[c]; 
                    const sourceDeparture = {"STATUS" : "DEPARTING"}
                    // const sourceClosest = {"CLOSEST" : `${airportCode}`}
                    // Object.assign(target,sourceArrival)
                    Object.assign(target,sourceDeparture)
                }
            }
         }
         setDisplayPilots(pilotsInRange)//
    }

   
    const sortAndCopyTables = async function (){
        console.log("Function #5: Sort and copy tables")
        // console.log("pilots to display", displayPilots)

        const displayMajors = displayPilots.filter(function(pilots) {
            return pilots.CLOSEST  === "KPDX" || pilots.CLOSEST  === "KSEA" ;
        })

        // console.log("display majors ", displayMajors.sort())
        // setDisplayMajors(displayMajors)    

    }


    const trackPlane = function(){
        console.log("track plane")
        return <button>Track</button>
    }

    // CREATE TABLES BASED ON STATUS
    let displayPilotsFixed;
    
    if (displayPilots){
        displayPilotsFixed = displayPilots.map((airplane,index) =>{
            let airplaneCallsign = airplane.callsign
            let airplaneGroundSpeed = airplane.groundspeed
            let airplaneLatitude = airplane.latitude
            let airplaneLongitude = airplane.longitude
            let airportClosest = airplane.CLOSEST
            let airplaneStatus = airplane.STATUS
            // console.log("airplane", airplane.callsign, airportClosest)
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
                        <td><button onClick={trackPlane}>Track</button>
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
                        <td><button onClick={trackPlane}>Track</button>
                        </td>
                    </tr>
                        )
            }
        })
    }



    // console.log("pilots in range for if statement", pilotsInRange)
    if (displayPilots === undefined || displayPilots === null) {
        console.log("display pilots value is ",displayPilots)
        console.log("SKIP DISPLAY")
    } else {
        console.log("Function #6: FINALLY display pilots ")
    }


   
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
        .then(()=>{
        if (airplanes !== undefined && airplanes.length > 0){
            getDistanceFromAirport()
        }
        })
        .then(()=>{
        if (airplanes !== undefined && airplanes.length > 0){
            buildPilotsInRange()
        }
        })
        .then(()=>{
            getClosestAirport()
        })
        .then(()=>{
            getFlightStatus()
        }).then(()=>{
            sortAndCopyTables()
        })
        .then(stopFetchVatsim)
    }
 
    
    const fetchVatsim = setInterval(() => 
    callVatsim(),10000)

    const stopFetchVatsim = ()=>{
        clearInterval(fetchVatsim)
    }
    // let airportsLookUp = airports.map(item => item.ICAO)
   //  console.log(airportsLookUp)



    function distance(lat1, lon1, lat2, lon2, unit) {
        //'M' is statute miles (default)
        //'K' is kilometers
        //'N' is nautical miles 
        if ((lat1 === lat2) && (lon1 === lon2)) {
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


    if (user){
    return(
        <div className="body">
            <Nav />
            <h3>Tracker</h3>
            <h3>All planes</h3>
            <table id="details">
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
                            <th>Track
                            </th>
                        </tr>   
                    </thead>
                     {displayPilots &&
                        <tbody>
                            {displayPilotsFixed}
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
