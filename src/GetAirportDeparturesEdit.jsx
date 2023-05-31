import React, { useState, useEffect } from 'react';


export default function GetAirportDeparturesEdit({airportICAO}) {

    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [departures, setDepartures] = useState([]);

   //MONGO DB GET DEPARTURES
    const mongoDepartureURL = "https://zsebrief-backend-production.up.railway.app/departures"

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
        let departureId = departure._id
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

        return (
                <div key={index}> 
                    <form>
                        <label>Last updated {departureUpdated}</label><br></br>
                        <label>Database id {departureId}</label><br></br>
                        <label>Name </label><input type="text" id="departureName" size="25" placeholder={departureName} /><br></br>
                        <label>Number </label><input type="text" id="departureNum" size="5" placeholder={departureNum} /><br></br>
                        <label>Type </label><input type="text" id="departureType" size="15" placeholder={departureType} /><br></br>
                        <label>Runway Specific </label><input type="text" id="departureRunway" size="5" placeholder={departureRunway} /><br></br>
                        <label>Top alt listed? </label><input type="text" id="departureTopAltListed" size="5" placeholder={departureTopAltListed} /><br></br>
                        <label>Top alt: </label><input type="text" id="departureTopAlt" size="25" placeholder={departureTopAlt} /><br></br>                        
                        <label>Need for interim alt? </label><input type="text" id="departureNeedForInterim" size="5" placeholder={departureNeedForInterim} /><br></br>
                        <label>Climb </label><input type="text" id="departureClimb" size="25" placeholder={departureClimb} /><br></br>
                        <label>Expect cruise </label><input type="text" id="departureExpectCruise" size="25" placeholder={departureExpectCruise} /><br></br>      
                        <label></label>        
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
        <div>
            <table id="details">

                <tbody>
                    {departuresList}
                </tbody>
                <br></br>
                <p></p>
            </table>
         </div>
    );
}  