import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import ReactDOM from "react-dom";
import AirportEditModal from './AirportEdit'
import { Link } from 'react-router-dom';
import { getDatabase, onValue, doc, getDocs, onSnapshot, ref, child, get, set } from "firebase/database";


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
        return airports.ICAO == airportICAO;
    })
    console.log("airport selected" , varAirportSelected)
    
    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }


    return (
        <div> <p>Return airport information here </p>
        </div>
    )

}

GetAirportDetailsEdit.propTypes = {
}