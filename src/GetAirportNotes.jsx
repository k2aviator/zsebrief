import React, { useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'


export default function GetAirportNotes({airportICAO}) {  
    console.log("airport ICAO", airportICAO)
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { themeName, toggleTheme } = useContext(ThemeContext);
    const [airportData, setAirportData] = useState()
    //MONGO DB Get Airport Details

    //const mongoAirportToken =  "?token=auNV6JNACu-VW3cd2FOL5OIhEzv1Q9qJxKiRQok2O7k"
    const mongoAirportsURL = `https://zsebrief-backend-production.up.railway.app/airports/${airportICAO}`
    // let mongoUrlFetch = `${mongoAirportURL}${mongoAirportToken}`

useEffect(() => {
    setIsLoading(true);

    fetch(mongoAirportsURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            setAirportData(data);
            setIsLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
            setHasError(true);
        });

}, [mongoAirportsURL]);


    console.log("airport data", airportData)
    const airportNotes = decodeURIComponent(airportData?.NOTES || "");


    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }


    return (
         <div>
            <p className={`headerText-${themeName}`}>NOTES</p>
            {airportNotes}
          
         </div>
    );
}