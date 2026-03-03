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
    const [notesInput, setNotesInput] = useState("");
    //MONGO DB Get Airport Details

    const mongoAirportsURL =
  `${process.env.REACT_APP_API_URL}/airports/${airportICAO}`;

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
            let decodedNotes = "";
             try {
                decodedNotes = data?.NOTES
                    ? decodeURIComponent(data.NOTES)
                    : "";
                console.log("decoted notes", decodedNotes)
            } catch (e) {
                decodedNotes = data?.NOTES || ""; // fallback if already decoded
            }

            setNotesInput(decodedNotes); 
            setIsLoading(false);
                })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
            setHasError(true);
        });

}, [mongoAirportsURL]);


    console.log("notes input", notesInput)
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
            {notesInput}
            </p>          
         </div>
    );
}