import React, { useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'
import API_BASE_URL from './config/react_api';

export default function GetAirportNotes({airportICAO}) {  
    console.log("airport ICAO", airportICAO)
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { themeName, toggleTheme } = useContext(ThemeContext);

    const [arrivalNotesInput, setArrivalNotesInput] = useState("");
    const [airportNotesInput, setAirportNotesInput] = useState("");
    //MONGO DB Get Airport Details

    const mongoAirportsURL =
  `${API_BASE_URL}/airports/${airportICAO}`;

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
            let decodedArrivalNotes = "";
             try {
                decodedArrivalNotes = data?.ARRIVAL_NOTES
                    ? decodeURIComponent(data.ARRIVAL_NOTES)
                    : "";
                console.log("decoted notes", decodedArrivalNotes)
            } catch (e) {
                decodedArrivalNotes = data?.ARRIVAL_NOTES || ""; // fallback if already decoded
            }
            setArrivalNotesInput(decodedArrivalNotes); 

            let decodedAirportNotes = "";
             try {
                decodedAirportNotes = data?.AIRPORT_NOTES
                    ? decodeURIComponent(data.AIRPORT_NOTES)
                    : "";
                console.log("decoted notes", decodedAirportNotes)
            } catch (e) {
                decodedAirportNotes = data?.AIRPORT_NOTES || ""; // fallback if already decoded
            }
            setAirportNotesInput(decodedAirportNotes); 
            setIsLoading(false);
                })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
            setHasError(true);
        });

}, [mongoAirportsURL]);


    console.log("notes input", arrivalNotesInput)
    // const airportNotes = decodeURIComponent(airportData?.NOTES || "");


    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }


    return (
         <div>
            <p className={`headerText-${themeName}`}>ARRIVAL NOTES</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>
            {arrivalNotesInput}
            </p>          
            <p className={`headerText-${themeName}`}>AIRPORT NOTES</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>
            {airportNotesInput}
            </p>       
         </div>
    );
}