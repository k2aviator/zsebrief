import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function GetAirportDepartures({airportICAO}) {  
    
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [departures, setDepartures] = useState([]);


    //MONGO DB GET DEPARTURES

    //const mongoAirportToken =  "?token=auNV6JNACu-VW3cd2FOL5OIhEzv1Q9qJxKiRQok2O7k"
    const mongoDepartureURL = "https://zsebrief-backend-production.up.railway.app/departures"
    // let mongoUrlFetch = `${mongoAirportURL}${mongoAirportToken}`

    useEffect(()=>{
        fetch(mongoDepartureURL)
        .then(response => response.json())
        .then((data) => {
            setDepartures(data);
            setIsLoading(false);   
            },
            (error)=>{
                console.log(error)
                setIsLoading(false);
                setHasError(true);
            })  
        }, [mongoDepartureURL])
    


    //filter for airport selected
    const varAirportSelected = departures.filter(function(departures) {
        return departures.ICAO === airportICAO;
    })

 



    //MAP Airport Runways
    const departuresList = varAirportSelected.map((departure,index) =>{
        // let departureICAO = departure.ICAO
        // let departureProcedure = departure.PROCEDURE
        let departureName = departure.NAME
        let departureNum = departure.NUM
        let departureType = departure.TYPE
        let departureRunway = departure.RWY_SPECIFIC
        // let departureTopAltListed = departure.TOP_ALT_LISTED
        //let departureNeedForInterim = departure.NEED_FOR_INTERIM_ALT
        let departureClimb = departure.CLIMB
        let departureTopAlt = departure.TOP_ALT
        let departureExpectCruise = departure.EXPECT_CRUISE
        // let departureUpdated = departure.LAST_UPDATED


        //Departure clearance phraseology 
        
        const depPhraseology = (departureType)=>{
            let phrase = ""
            if (departureType === "R/V"){
                phrase = `...via the ${departureName} ${departureNum} departure, radar vectors to {FIX}, then as filed... `
                return phrase
            } else if (departureType === "RNAV"){
                phrase = `...via the ${departureName} ${departureNum} departure`
                return phrase
            } else if (departureType === "ODP_NAMED"){
                phrase = `...via the ${departureName} ${departureNum} departure`
                return phrase
            } else if (departureType === "ODP_NOT_NAMED"){
                phrase = `Depart via the (airport name) (runway number) departure procedure`
                return phrase
            } else if (departureType === "RADIAL-TRANS"){
                phrase = `...via the ${departureName} ${departureNum} departure`
                return phrase
            } else if (departureType === "R/V_NO_DEP"){
                phrase = `...via radar vectors to {FIX}, then as filed...`
                return phrase
            }
        }

        //Departure climb phraseology 

        const depClimbPhraseology = (departureTopAlt) => {
            departureTopAlt = String(departureTopAlt)
            let climbPhrase = ""
            if (departureTopAlt.includes("DON'T")){
                climbPhrase = `---`
                return climbPhrase
            } else {
                climbPhrase = departureTopAlt
                return climbPhrase
            }
        }

        //Preffered runway

        const depPreferredRunway = (departureRunway) => {
            let depPreferredRunway = ""
            if (departureRunway){
                depPreferredRunway = "Rwy: " + departureRunway
                return depPreferredRunway
            } else {
                depPreferredRunway = ""
                return depPreferredRunway
            }
        }

        return (
        
                <tr key={index}> 
                    <td>({departureType}) {depPreferredRunway(departureRunway)}</td>
                    <td>{depPhraseology(departureType)}</td>
                    <td>{departureClimb}</td>
                    <td>{depClimbPhraseology(departureTopAlt)}</td>
                    <td>{decodeURIComponent(departureExpectCruise)}</td>
                </tr>
        )
    })


    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }


    return (
        <div>
            <p className="headerText">DEPARTURES</p>
            <table id="details">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Phraseology</th>
                        <th>Climb</th>
                        <th>Top Alt</th>
                        <th>Expect Cruise</th>
                    </tr>
                </thead>
                <tbody>
                    {departuresList}
                </tbody>
            </table>
         </div>
    );
}

GetAirportDepartures.propTypes = {
    airportICAO: PropTypes.string.isRequired,
  };