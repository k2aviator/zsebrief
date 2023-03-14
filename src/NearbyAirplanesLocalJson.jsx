import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { useLocation } from 'react-router-dom'
import firebase from 'firebase/compat/app'
import { getDatabase, ref, get, } from "firebase/database";
import Login from './Login'
import samplePlaneData from './vatsim-data.json'

// https://data.vatsim.net/v3/vatsim-data.json


const cors1 = "https://thingproxy.freeboard.io/fetch/"
const cors2 = "https://cors-anywhere.herokuapp.com/"
const cors3 = "https://zsebrief.web.app/"
const vatsimURL = `${cors3}https://data.vatsim.net/v3/vatsim-data.json`

let testPilotsJson = samplePlaneData.pilots;

export default function NearbyAirplanesLocalJson(){

    const [airports, setAirports] = useState([])
    const [user, setUser] = useState({})
    const [hasError, setHasError] = useState(false);
    const [loading,toggleLoading] = useState(true);
    const [airplanes, setAirplanes] = useState(undefined)

    
    
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

     let airportsLookUp = airports.map(item => item.ICAO)
     console.log(airportsLookUp)

    // useEffect(()=>{
    //     var headers = {}
    //     fetch(vatsimURL,{
    //         method : "GET",
    //     })
    //     .then(response => response.json())
    //     .then((data) => {
    //         setAirplanes(data.pilots);
    //         //console.log(data)
    //         toggleLoading(false);   
    //       },
    //         (error)=>{
    //           console.log(error)
    //           toggleLoading(false);
    //           setHasError(true);
    //       })  
    //     }, [vatsimURL])

    //CENTRAL LOCATION FOR FILTERING (UKIAH, OREGON)
    const centerLat = "45.133690"
    const centerLong = "-118.931670"
    const centerRadius = 350

        
    const getDistanceFromAirport = function(pilots){
        for (var i = 0; i < pilots.length; i++){
            let airplaneLatitude = pilots[i].latitude
            let airplaneLongitude = pilots[i].longitude
            let distanceTable = ""
            distanceTable = distance(centerLat,centerLong,airplaneLatitude,airplaneLongitude,"N")
            const target = pilots[i];  
            // console.log("distance", distanceTable)          
            const source = {"DIST_ZSE" : distanceTable}
            Object.assign(target,source)
        }
        return pilots
    }

    //first get the distance of all pilots
    getDistanceFromAirport(testPilotsJson)
    
    //filter data for piliots in range
    let pilotsInRange = testPilotsJson.filter(item => item.DIST_ZSE <= 350)


    //sort pilots by distance
    pilotsInRange = pilotsInRange.sort(function(x,y){
        return x.DIST_ZSE - y.DIST_ZSE
    })
    console.log(pilotsInRange)


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
    
    const airplaneList = pilotsInRange.map((airplane,index) =>{
        // console.log(airplane.flight_plan.departure)
        let airplaneCallsign = airplane.callsign
        let airplaneLatitude = airplane.latitude
        let airplaneLongitude = airplane.longitude
        let airplaneGroundSpeed = airplane.groundspeed
        let airplaneDistance = airplane.DIST_ZSE
        let airplaneOrigin;
        let airplaneArrival;
        if (airplane.flight_plan === null | airplane.flight_plan === undefined) {
            airplaneOrigin = "NA" 
            airplaneArrival = "NA" 
        } else {
            airplaneOrigin = airplane.flight_plan.departure
            airplaneArrival = airplane.flight_plan.arrival
        }
    
        return (           
        <tr key={index}>
            <td>{airplaneCallsign}
            </td>
            <td>{airplaneLatitude}
            </td>
            <td>{airplaneLongitude}
            </td>
            <td>{airplaneDistance}
            </td>
            <td>{airplaneGroundSpeed}
            </td>
            <td>{airplaneOrigin}
            </td>
            <td>{airplaneArrival}
            </td>
        </tr>
       

        )
    })

    // if (loading) {
    //     return <p>loading...</p>
    // }

    // if (hasError) {
    //     return <p>Has error!</p>
    // }



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
                            <th>Dist.
                            </th>
                            <th>GS
                            </th>
                            <th>Origin
                            </th>
                            <th>Dest.
                            </th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {airplaneList}
                    </tbody>
            </table>
        </div>
      
    )
    } else {
        return(
            <Login />
        )
    }

}
