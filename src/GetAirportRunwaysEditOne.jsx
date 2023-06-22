import React, { useState, useEffect, useCallback, useMemo} from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import UtilAdminRole from './UtilAdminRole';
import Header from './Header';
import Footer from './Footer'

export default function GetAirportRunwaysEditOne() {  
    const navigate = useNavigate()
    // eslint-disable-next-line no-unused-vars
    const isAdminRole = UtilAdminRole()
    var token = localStorage.getItem('token')
    const location = useLocation()
    const routerLocation = useLocation();
    const { airportICAO, runwayId } = routerLocation.state;
    const [runway, setRunway] = useState([])
    const [updatedRunway, setUpdatedRunway] = useState(false)
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [previewCalmRwy, setPreviewCalmRwy] = useState()
    const [previewCalmRwyThresh, setPreviewCalmRwyThresh] = useState()
    const [previewDVA, setPreviewDVA] = useState()
    const [previewODP, setPreviewODP] = useState()
    const [previewIAP, setPreviewIAP] = useState()
    const [previewLength, setPreviewLength] = useState()
    const [previewWidth, setPreviewWidth] = useState()
    const [previewMag, setPreviewMag] = useState()
    const [previewTrue, setPreviewTrue] = useState()
    const [previewPattern, setPreviewPattern] = useState()

    //FORM Interactive Elements
    const [formData, setFormData] = useState([])


    //HANDLE DROP DOWN FUNCTIONALITY

    const handleDropDown = useCallback((event, keyName) => {
        const key = keyName;
        const value = event.target.value;
        const existingKeyValuePair = formData.find((item) => Object.prototype.hasOwnProperty.call(item, key));
        if (existingKeyValuePair) {
          // Update the existing key-value pair
          if (key === 'DVA' || key ==='ODP'){
            existingKeyValuePair[key] = encodeURIComponent(value);
            setFormData([...formData]);
          } else {
            existingKeyValuePair[key] = value;
            setFormData([...formData]);
          }
    
        } else {
            if (key === 'DVA' || key ==='ODP'){
                setFormData(prevData => [...prevData, { [key]: encodeURIComponent(value) }]);
            } else {
                setFormData(prevData => [...prevData, { [key]: value }]);
            }
          // Add a new key-value pair to the array
         
        }
      }, [formData]);
      

    function refreshPage() {
        setTimeout(() => {
            navigate(`/details/${airportICAO}/runways`,{state: { airportICAO }})
         }, 2000); // Refresh after 3 seconds (3000 milliseconds)
    }

    //MONGO DB GET BY RUNWAY ID
    const mongoRunwaysById = `https://zsebrief-backend-production.up.railway.app/runways/${runwayId}`//PRODUCTION
    //const mongoRunwaysById = `http://localhost:3000/runways/${runwayId}`//TEST

    useEffect(()=>{
    fetch(mongoRunwaysById)
    .then(response => response.json())
    .then((data) => {
        setRunway(data);
        setPreviewCalmRwy(data.CALM_WIND_RUNWAY)
        setPreviewCalmRwyThresh(data.CALM_WIND_THRESHOLD)
        setPreviewDVA(decodeURIComponent(data.DVA))
        setPreviewODP(decodeURIComponent(data.ODP))
        setPreviewIAP(data.IAP)
        setPreviewLength(data.LENGTH_FT)
        setPreviewWidth(data.WIDTH_FT)
        setPreviewMag(data.MAG_HEADING)
        setPreviewTrue(data.TRUE_HEADING)
        setPreviewPattern(data.TRAFFIC_PATTERN)
        setIsLoading(false);   
        },
        (error)=>{
            console.log(error)
            setIsLoading(false);
            setHasError(true);
        })  
    }, [])

 
     //BEGIN HANDLE RUNWAY OVERVIEW EDIT/SUBMIT 

    //FORM INPUTS
    const rwyDvaInput = document.getElementById('depExpectedCruise')


    const handleRunwayEdit = (event)=>{
        
        event.preventDefault();
        var runwayEditForm = document.getElementById('runwayEditForm');

        //array to submit

        var runwayFormData = formData;
           
        //push airport ICAO 
        runwayFormData.push({ICAO:airportICAO})


        //encode ODB
        
        //push date
        const currentDate = new Date();
        const formattedTimestamp = currentDate.toISOString();
        runwayFormData.push({"UPDATED":formattedTimestamp})

        //console.log("departureFormData so far ", departureFormData)

        var token = localStorage.getItem('token');

        //reduce the array 


       // console.log("runway form data before reduction", runwayFormData)

        const transformedRunwayFormData = runwayFormData.reduce((result, item) => {
        const key = Object.keys(item)[0]; // Assuming each object has only one key
        const value = item[key];
        result[key] = value;
        return result;
        }, {});


        //console.log("form data to submit ", transformedRunwayFormData)

        const fetchData = async () => {
                
            fetch(`${mongoRunwaysById}`, {
            method:'PUT',
            body: JSON.stringify(transformedRunwayFormData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Set the Authorization header with the token
                },
            }).then(response=> response.json()
            ).then(data=>{
                if (data !== null) {
                    //console.log("returned data is ", JSON.stringify(data));
                    setUpdatedRunway(true)
                    refreshPage()
                } else {
                    // console.log("No data returned from the server");
                    setUpdatedRunway(false)
                }
            }).catch (error => {
                console.error('An error occurred:', error);
            })
        }
        fetchData()
        }

     //END HANDLE DEPARTURE OVERVIEW EDIT/SUBMIT 

    let runwayUpdated = runway.UPDATED
    let runwayUpdatedBy = runway.UPDATED_BY
    let runwayNumber = runway.RUNWAY
 
    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }

    return (
        <div>
            <div className='main-body'>
                <div className="sticky-header">
                    <Header />
                </div>
                <div className="details-margin-top">
                    <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button>Back to all details</button></Link>            
                    <Link to={`/details/${airportICAO}/runways`} state={{airportICAO}}> <button>Back to {airportICAO} runways</button></Link>
                </div>
                <div>
                <h3>Edit {airportICAO} Runway {runwayNumber} </h3>
                </div>
                <div>
                    <form id="runwayEditForm" onSubmit = {handleRunwayEdit}>
                        <label>Last updated: {runwayUpdated}</label><br></br>
                        <label>Updated by: {runwayUpdatedBy}</label><br></br>
                        <label>Database id: {runwayId}</label><br></br>
                        <label>Calm wind runway: </label>
                        <select id="rwyCalmOption" value={previewCalmRwy} onChange={(event) => {handleDropDown(event, "CALM_WIND_RUNWAY"); setPreviewCalmRwy(event.target.value)}}>
                            <option value=""></option>
                            <option value="TRUE">TRUE</option>
                            <option value="FALSE">FALSE</option>
                        </select><br></br>
                        <label>Calm threshold: </label><input type="text" id="rwyCalmThreshold" size="2" placeholder={previewCalmRwyThresh}  pattern="^[0-9]{0,3}$" onChange={(event) => {handleDropDown(event, "CALM_WIND_THRESHOLD"); setPreviewCalmRwyThresh(event.target.value)}}/><br></br>                    
                        <label>DVA: </label><input type="text" id="rwyDVA" size="100" placeholder={previewDVA}  onChange={(event) => {handleDropDown(event, "DVA"); setPreviewDVA(event.target.value)}}/><br></br>             
                        <label>ODP: </label><input type="text" id="rwyODP" size="100" placeholder={previewODP}  onChange={(event) => {handleDropDown(event, "ODP"); setPreviewODP(event.target.value)}}/><br></br>                           
                        <label>IAP: </label><select id="rwyIAP" value={previewIAP} onChange={(event) => {handleDropDown(event, "IAP"); setPreviewIAP(event.target.value)}}>
                            <option value=""></option>
                            <option value="ILS">ILS</option>
                            <option value="MLS">MLS</option>
                            <option value="LOC/DME">LOC/DME</option>
                            <option value="LOC/GS">LOC/GS</option>
                        </select><br></br>
                        <label>Length: </label><input type="text" id="rwyLength" size="2" placeholder={previewLength}  pattern="^[0-9]{0,5}$" onChange={(event) => {handleDropDown(event, "LENGTH_FT"); setPreviewLength(event.target.value)}}/><br></br>                    
                        <label>Width: </label><input type="text" id="rwyWidth" size="2" placeholder={previewWidth}  pattern="^[0-9]{0,4}$" onChange={(event) => {handleDropDown(event, "WIDTH_FT"); setPreviewWidth(event.target.value)}}/><br></br>                    
                        <label>Mag Heading: </label><input type="text" id="rwyMagHeading" size="2" placeholder={previewMag}  pattern="^[0-9]{0,3}$" onChange={(event) => {handleDropDown(event, "MAG_HEADING"); setPreviewMag(event.target.value)}}/><br></br>                    
                        <label>True Heading: </label><input type="text" id="rwyTrueHeading" size="2" placeholder={previewTrue}  pattern="^[0-9]{0,3}$" onChange={(event) => {handleDropDown(event, "TRUE_HEADING"); setPreviewTrue(event.target.value)}}/><br></br>                    
                        <label>Traffic Pattern: </label><select id="rwyPattern" value={previewPattern} onChange={(event) => {handleDropDown(event, "TRAFFIC_PATTERN"); setPreviewPattern(event.target.value)}}>
                            <option value=""></option>
                            <option value="LEFT">LEFT</option>
                            <option value="RIGHT">RIGHT</option>
                        </select><br></br>
                        <br></br>
                        <button type="submit">Submit</button>{updatedRunway ===true  && <p id="success-message">Success: runway has been updated.</p>}
                        <p></p>  
                    </form>
                </div>
                <div>
                    &nbsp;<br></br>
                    &nbsp;<br></br>
                </div>
                
            </div>
            <div className="footer">
                    <Footer/> 
            </div> 
        </div>
    )

       




}

