import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from "firebase/database";

export default function GetAirportDepartures({airportICAO}) {  
    
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [departures, setDepartures] = useState([]);

    useEffect(()=>{
    
        const db = getDatabase();
        const departuresdb = ref(db,'departures/');
     

        get(departuresdb).then((snapshot) => {
            //console.log(snapshot.val());
            setIsLoading(false);
                if(snapshot.exists()){
                    console.log("data exists")
                    setDepartures(snapshot.val())
                } else {
                    console.log("no data exists")
                    setHasError(true)
                }         
            }).then(
            )
        }, [])

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
        let departureTopAltListed = departure.TOP_ALT_LISTED
        let departureNeedForInterim = departure.NEED_FOR_INTERIM_ALT
        let departureClimb = departure.CLIMB
        let departureTopAlt = departure.TOP_ALT
        let departureExpectCruise = departure.EXPECT_CRUISE
        let departureUpdated = departure.LAST_UPDATED


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
                    <td>{departureExpectCruise}</td>
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
