import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get} from "firebase/database";


export default function GetAirportDetailsEdit({airportICAO}) {  
    const [airports, setAirports] = useState([])
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
    
        const db = getDatabase();
        const airportsdb = ref(db,'airports/');
        
        get(airportsdb).then((snapshot) => {
            // console.log(snapshot.val());
            setIsLoading(false);
                if(snapshot.exists()){
                    // console.log("data exists")
                    setAirports(snapshot.val())
                } else {
                    // console.log("no data exists")
                    setHasError(true)
                }         
            }).then(
                // console.log(airports)
            )
        }, [])

    const varAirportSelected = airports.filter(function(airports) {
        // console.log("airports filter", airports.ICAO)
        // console.log("airports filter", airportICAO)
        return airports.ICAO === airportICAO;
    })
    // console.log("airport selected" , varAirportSelected)

    const airportList = varAirportSelected.map((airport,index) =>{
        let airportICAO = airport.ICAO
        let airportName = airport.NAME
        let airportTowered = airport.TOWERED
        let airportHoursOpen = airport.HRS_OPEN
        let airportHoursClose = airport.HRS_CLOSE
        let airportClass = airport.AIRSPACE_CLASS
        let airportElev = airport.ELEV
        let airportNotes = airport.NOTES
        let airportUpdated = airport.UPDATED
        
        console.log("test")
        return(
            <div key={index}>
            <form>
                <label><b>{airportICAO}: {airportName}</b></label><br></br>
                <label>Last updated {airportUpdated}</label><br></br>
                <label>Elevation: </label><input type="text" id="airportElev" size="1" placeholder={airportElev} /><br></br>
                <label>Airspace Class: </label><input type="text" id="airportClass" size="1" placeholder={airportClass} /><br></br>
                <label>Towered: </label><input type="text" id="airportTowered" size="1" placeholder={airportTowered} /><br></br>
                <label>Hour Open: </label><input type="text" id="airportHoursOpen" size="1" placeholder={airportHoursOpen} /><br></br>
                <label>Hour Closed: </label><input type="text" id="airportHoursClose" size="1" placeholder={airportHoursClose} /><br></br>
                <label>Notes: </label><input type="text" id="airportNotes" size="40" placeholder={airportNotes} /><br></br>
                <br></br>
                <p></p>
            </form>
        </div>
        )

    })
    




    
    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }


    return (
        <div> {airportList}
        </div>
    )

}

GetAirportDetailsEdit.propTypes = {
}