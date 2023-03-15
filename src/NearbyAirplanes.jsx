import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, } from "firebase/database";
import Header from './Header';
import Login from './Login';
import { distance } from './utilDistance'
import DisplayPilotTable from './DisplayPilotTable'
import DisplayPilotTableHead from './DisplayPilotTableHead'
import Tracker from './Tracker'


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
    const [loadSpeed, setLoadSpeed] = useState(500)

    //GET AIRPORT LIST FROM FIREBASE DATABASE
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
        console.log("Function #1A - Get all airplane distances from center point")
        // 1A GET DISTANCES FROM CENTER POINT
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
        // console.log("function 1 output ", airplanes)

        // 1B BUILD A DISPLAY FOR PILOTS IN RANGE
        //filter data for pilots in range
        let pilotsInRange = airplanes.filter(item => item.DIST_ZSE <= 350 && item.groundspeed <= 80)
        //Below: Exclude North of Canada border
        pilotsInRange = pilotsInRange.filter(item => item.latitude <= 49.002053 && item.latitude >= 40.333329)
        //Below: Exclude Victoria area
        pilotsInRange = pilotsInRange.filter(item => !((item.latitude <= 49.002053 && item.latitude >= 48.251827) && (item.longitude <= -123.218793 && item.longitude >= -123.960865)) )
        console.log("Function #1B - Pilots table in range results ",  pilotsInRange)
        setPilotsInRange(pilotsInRange)
    
    }
   
    const getClosestAirport = async function (){
        console.log("Function #2 - Get closest airports for pilots in range")
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
        console.log("Function #4: Get flight status", pilotsInRange)
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

    let majors;
    let minors; 
    let noClosest;

    if (displayPilots){
        majors = displayPilots.filter(function(pilots) {
            return pilots.CLOSEST  === "KPDX" || pilots.CLOSEST  === "KSEA" ;})
        minors = displayPilots.filter(function(pilots) {
            return !(pilots.CLOSEST  === "KPDX" || pilots.CLOSEST  === "KSEA" | pilots.CLOSEST === undefined) ;})
        noClosest = displayPilots.filter(function(pilots) {
            return (pilots.CLOSEST === undefined); })
    } 


    // console.log("pilots in range for if statement", pilotsInRange)
    if (displayPilots === undefined || displayPilots === null) {
        // console.log("display pilots value is ",displayPilots)
        console.log("SKIP DISPLAY")
    } else {
        console.log("Function #6: FINALLY display pilots ")
    }

    let timestamp1 = "2023-03-15T04:37:46.1558713Z"
    let timestamp2 = "2023-03-15T01:56:40.0739964Z"
   
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
        if (airplanes !== undefined){
            getDistanceFromAirport()
        }
        })
        .then(()=>{
        if (pilotsInRange !== undefined) {
            getClosestAirport()
        }
        })
        .then(()=>{
        if (pilotsInRange !== undefined) {
            getFlightStatus()
            setLoadSpeed(30000)
        }
        })
        .then(stopFetchVatsim)
    }
 
    
    const fetchVatsim = setInterval(() => 
    callVatsim(),loadSpeed)

    const stopFetchVatsim = ()=>{
        clearInterval(fetchVatsim)
    }




    const trackPlane = function(airplane){
        console.log("track plane", airplane.target)
        return <button>Track</button>
    }


    if (user){
    return(
        <div className="body">
            <Header />
            <h3>Tracker</h3>
                <Tracker />
            <h3>Minor Airports</h3>
                 <table id="details">
                    <thead>
                        <DisplayPilotTableHead/>
                    </thead>
                     {displayPilots &&
                    <tbody>
                        <DisplayPilotTable displayTable={minors} trackPlane={trackPlane}/>
                    </tbody>
                    }
                </table>
            <h3>No Nearby Airports</h3>
                 <table id="details">
                    <thead>
                        <DisplayPilotTableHead/>
                    </thead>
                     {displayPilots &&
                    <tbody>
                        <DisplayPilotTable displayTable={noClosest} trackPlane={trackPlane}/>
                    </tbody>
                    }
                    
            </table>
            <h3>Major Airports</h3>
                 <table id="details">
                    <thead>
                        <DisplayPilotTableHead/>
                    </thead>
                     {displayPilots &&
                    <tbody>
                        <DisplayPilotTable displayTable={majors} trackPlane={trackPlane}/>
                    </tbody>
                    }
                </table>
        </div>
      
    )
    } else {
        return(
            <Login />
        )
    }

}
