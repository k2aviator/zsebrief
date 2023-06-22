import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UtilAdminRole from './UtilAdminRole';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

export default function GetAirportDeparturesEdit({airportICAO}) {


    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [departures, setDepartures] = useState([]);
    const isAdminRole = UtilAdminRole()
    const { themeName, toggleTheme } = useContext(ThemeContext)
    const buttonDark = themeName === "dark" ? 'button-dark' : '';
    
    if (!airportICAO){
        console.log("airport ICAO not defined")
    }


    //MONGO DB GET DEPARTURES
    const mongoDepartureURL = "https://zsebrief-backend-production.up.railway.app/departures" //PRODUCTION
    //const mongoDepartureURL = "http://localhost:3000/departures" //TEST

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
        let departureId = departure._id
        let departureUpdatedBy = departure.UPDATED_BY
        let departureName = departure.NAME
        let departureNum = departure.NUM
        let departureType = departure.TYPE
        let departureRunway = departure.RWY_SPECIFIC
        let departureTopAltListed = departure.TOP_ALT_LISTED
        let departureNeedForInterim = departure.NEED_FOR_INTERIM_ALT
        let departureClimb = departure.CLIMB
        let departureTopAlt = departure.TOP_ALT
        let departureExpectCruise = decodeURIComponent(departure.EXPECT_CRUISE)
        let departureUpdated = departure.UPDATED

        return (
                <div key={index}> 
                    <form >
                        <label>Last updated: {departureUpdated}</label><br></br>
                        <label>Updated by {departureUpdatedBy}</label><br></br>
                        <label>Database id: {departureId}</label>&nbsp; {isAdminRole &&  <span><Link to={`/details/${airportICAO}/departures/${departureId}`} state={{airportICAO, departureId}}> <button className={buttonDark}>Edit departure</button></Link></span> } <br></br>
                        <label>Name: {departureName} </label><br></br>
                        <label>Number: {departureNum}</label><br></br>
                        <label>Type: {departureType}</label><br></br>
                        <label>Runway Specific: {departureRunway}</label><br></br>
                        <label>Top alt listed? {departureTopAltListed} </label><br></br>
                        <label>Top alt: {departureTopAlt}</label><br></br>                        
                        <label>Need for interim alt? {departureNeedForInterim}</label><br></br>
                        <label>Climb instruction: {departureClimb}</label><br></br>
                        <label>Expect cruise: {departureExpectCruise}</label><br></br>      
                        &nbsp;
                        <br></br>    
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
            {departuresList}
            &nbsp;<br></br>
            &nbsp;<br></br>      
        </div>
    );
}  


GetAirportDeparturesEdit.propTypes = {
    airportICAO: PropTypes.string.isRequired,
    // other prop types
  };