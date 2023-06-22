import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UtilAdminRole from './UtilAdminRole';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

export default function GetAllAirportRunways({airportICAO}) {  
            
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [runways, setRunways] = useState([])
    const isAdminRole = UtilAdminRole()
    const { themeName, toggleTheme } = useContext(ThemeContext)
    const buttonDark = themeName === "dark" ? 'button-dark' : '';

     //MONGO DB GET RUNWAYS
    const mongoRunwaysURL = "https://zsebrief-backend-production.up.railway.app/runways"

    useEffect(()=>{
        fetch(mongoRunwaysURL)
        .then(response => response.json())
        .then((data) => {
            setRunways(data);
            setIsLoading(false);   
            },
            (error)=>{
                console.log(error)
                setIsLoading(false);
                setHasError(true);
            })  
        }, [mongoRunwaysURL])


    const varAirportSelected = runways.filter(function(runways, index) {
        runways.index = index
        return runways.ICAO === airportICAO;
    })
    

    const runwaysList = varAirportSelected.map((runway,index) =>{
        let runwayCalmWind = runway.CALM_WIND_RUNWAY
        let runwayCalmWindThreshold = runway.CALM_WIND_THRESHOLD
        let runwayDVA = decodeURIComponent(runway.DVA) 
        let runwayIAP = runway.IAP
        let runwayLength = runway.LENGTH_FT
        let runwayMagHeading = runway.MAG_HEADING
        let runwayODP = decodeURIComponent(runway.ODP)
        let runwayNumber = runway.RUNWAY
        let runwayPatternDirection = runway.TRAFFIC_PATTERN
        let runwayTrueHeading = runway.TRUE_HEADING
        let runwayUpdated = runway.UPDATED
        let runwayWidth = runway.WIDTH_FT
        let runwayIndex = runway.INDEX
        let runwayId = runway._id
        let runwayUpdatedBy = runway.UPDATED_BY

        return (
            <div key={index}>
                <form>
                    <label><b>Runway {runwayNumber}</b></label><br></br>
                    <label>Last updated {runwayUpdated}</label><br></br>
                    <label>Updated by: {runwayUpdatedBy}</label><br></br>
                    <label>Database id: {runwayId}</label>&nbsp; {isAdminRole &&  <span><Link to={`/details/${airportICAO}/runways/${runwayId}`} state={{airportICAO, runwayId}}> <button className={buttonDark}>Edit runway</button></Link></span> } <br></br>
                    <label>Calm Wind Runway? {runwayCalmWind}</label><br></br>
                    <label>Calm threshold: {runwayCalmWindThreshold}</label><br></br>
                    <label>DVA: {runwayDVA}</label><br></br>
                    <label>ODP: {runwayODP}</label><br></br>
                    <label>IAP: {runwayIAP}</label><br></br>
                    <label>Length (FT): {runwayLength}</label><br></br>
                    <label>Width (FT): {runwayWidth} </label><br></br>
                    <label>HDG (Mag): {runwayMagHeading}</label><br></br>
                    <label>HDG (True): {runwayTrueHeading}</label><br></br>
                    <label>Traffic pattern: {runwayPatternDirection}</label><br></br> 
                    <br></br>
                    <p></p>
                </form>
            </div>
        )
    })

    // console.log("airport selected", varAirportSelected)

    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }

    return (
        <div>
            {runwaysList}
        </div>
    );
}

GetAllAirportRunways.propTypes = {
    airportICAO: PropTypes.string.isRequired,
  };