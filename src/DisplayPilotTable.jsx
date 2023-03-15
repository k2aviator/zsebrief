import React, { useState, useEffect } from 'react';


export default function DisplayPilotTable(displayTable, {trackPlane}) {  
    const tableDisplay = displayTable.displayTable.map((airplane,index) =>{
        let airplaneCallsign = airplane.callsign
        let airplaneGroundSpeed = airplane.groundspeed
        let airplaneLatitude = airplane.latitude
        let airplaneLongitude = airplane.longitude
        let airportClosest = airplane.CLOSEST
        let airplaneStatus = airplane.STATUS
        let airplaneLogon = airplane.logon_time
        let airplaneLastUpdate = airplane.last_updated
        let airplaneTimeOnline = airplaneLastUpdate
        // console.log("airplane", airplane.callsign, airportClosest)
        let airplaneOrigin;
        let airplaneArrival;
        if (airplane.flight_plan === null | airplane.flight_plan === undefined) {
            airplaneOrigin = "NONE" 
            airplaneArrival = "NONE" 
            return (           
                <tr key={index} onClick={displayTable.trackPlane}>
                    <td>{airplaneCallsign}
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
                    <td>{airplaneTimeOnline}
                    </td>
                    <td><button>Track</button>
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
                    <td>{airplaneTimeOnline}
                    </td>
                    <td><button onClick={displayTable.trackPlane}>Track</button>
                    </td>
                </tr>
                    )
        }      
    })
    return tableDisplay
}

