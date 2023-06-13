import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { depPhraseology } from './utilDepPhraseology'
import UtilAdminRole from './UtilAdminRole';
import Header from './Header';
import Footer from './Footer'

export default function GetAirportDeparturesAddOne() {  
    const navigate = useNavigate()
    // eslint-disable-next-line no-unused-vars
    const location = useLocation()
    const routerLocation = useLocation();
    const { airportICAO } = routerLocation.state;
    // eslint-disable-next-line no-unused-vars
    const [departure, setDeparture] = useState([])
    const [addedDeparture, setAddedDeparture] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const isAdminRole = UtilAdminRole()
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [previewType, setPreviewType] = useState()
    const [previewPhrase, setPreviewPhrase] = useState()
    const [previewTopAltListed, setPreviewTopAltListed] = useState()
    const [previewClimbPhrase, setPreviewClimbPhrase] = useState()
    const [previewExpectedCruise, setPreviewExpectedCruise] = useState()
    const [runwayList, setRunwayList] = useState();
    const [previewDepRunway, setPreviewDepRunway] = useState()
    const [previewNeedForInterim, setPreviewNeedForInterim] = useState()
    const [previewName, setPreviewName] = useState()
    const [previewNum, setPreviewNum] = useState()
    const [previewTopAlt, setPreviewTopAlt] = useState()

    //FORM Interactive Elements
    const [formData, setFormData] = useState([])

    //MONGO DB GET RUNWAYS LIST
    const mongoRunwaysById = `https://zsebrief-backend-production.up.railway.app/runways/numbers/${airportICAO}`//PRODUCTION
    //const mongoRunwaysById = `http://localhost:3000/runways/numbers/${airportICAO}`//TEST
    useEffect(()=>{
    fetch(mongoRunwaysById)
    .then(response => response.json())
    .then((data) => {
        setRunwayList(data)
        setIsLoading(false);   
        },
        (error)=>{
            console.log(error)
            setIsLoading(false);
            setHasError(true);
        })  
        }, [])

    //

    //HANDLE DROP DOWN FUNCTIONALITY

    const handleDropDown = useCallback((event, keyName) => {
        const key = keyName;
        const value = event.target.value;
        const existingKeyValuePair = formData.find((item) => Object.prototype.hasOwnProperty.call(item, key));
        if (existingKeyValuePair) {
          // Update the existing key-value pair
          existingKeyValuePair[key] = value;
          setFormData([...formData]);
        } else {
          // Add a new key-value pair to the array
          setFormData(prevData => [...prevData, { [key]: value }]);
        }
      }, [formData]);

    //Departure Phraseology Preview Function
    const [depType, setDepType] = useState('');
    const [depName, setDepName] = useState('');
    const [depNumber, setDepNumber] = useState('');
    const [depTopAlt, setDepTopAlt] = useState('');
    const [depClimbIns, setDepClimbIns] = useState('');
    const [depExpectedCruise, setDepExpectedCruise] = useState('');
    const [depTopAltListed, setDepTopAltListed] = useState('');
   
    //BEGIN PHRASEOLOGY BUILDER FUNCTION

    useEffect(() => {
        function handlePhraseologyBuilder(event, fieldName) {
          const value = event.target.value;
          // Handle the input change here, including the field name
          if (fieldName === "depType") {
            setDepType(value);
          } else if (fieldName === "depName") {
            setDepName(value);
          } else if (fieldName === "depNumber") {
            setDepNumber(value);
          } else if (fieldName === "depTopAlt") {
            setDepTopAlt(value);
          } else if (fieldName === "depClimbIns") {
            setDepClimbIns(value);
          } else if (fieldName === "depExpectedCruise") {
            setDepExpectedCruise(value);
          } 
        }
      
        const inputElementIds = ['depType', 'depName', 'depNumber', 'depTopAlt', 'depClimbIns', 'depExpectedCruise'];
        inputElementIds.forEach((inputElementId) => {
          const inputElement = document.getElementById(inputElementId);
          if (inputElement) {
            inputElement.addEventListener('input', (event) => handlePhraseologyBuilder(event, inputElementId));
          }
        });
      
        return () => {
          inputElementIds.forEach((inputElementId) => {
            const inputElement = document.getElementById(inputElementId);
            if (inputElement) {
              inputElement.removeEventListener('input', (event) => handlePhraseologyBuilder(event, inputElementId));
            }
          });
        };
      }, []);

    //END PHRASEOLOGY BUILDER FUNCTION

    //Handle phraseology preview
    function buildPhraseology(previewType){
        // console.log("preview type is ", previewType)
        const [climbPhraseBuilder, expectedCruiseBuilder] = depPhraseology(previewType, previewName, previewNum, previewTopAlt)
        setPreviewPhrase(climbPhraseBuilder);
        setPreviewExpectedCruise(expectedCruiseBuilder);
    }

    function refreshPage() {
        setAddedDeparture(true)
        setTimeout(() => {
             navigate(`/details/${airportICAO}/departures`,{state: { airportICAO }})
          }, 2000); // Refresh after 3 seconds (3000 milliseconds)
      }



    //Begin handle departure add function
    const handleDepartureAdd = (event)=>{
        
        event.preventDefault();
        var airportOverviewForm = document.getElementById('departureAddForm');

        //identify all form elements
        const depNameInput = document.getElementById('depName')
        const depNumberInput = document.getElementById('depNumber')
        const depTypeInput = document.getElementById('depType')
        const depRwySpecificInput = document.getElementById('depRwySpecific')
        const depTopAltListedInput = document.getElementById('depTopAltListed')
        const depTopAltInput = document.getElementById('depTopAlt')
        const depInterimAltInput = document.getElementById('depInterimAlt')
        const depClimbInsInput = document.getElementById('depClimbIns')
        const depExpectedCruiseInput = document.getElementById('depExpectedCruise')

        //clear validity statements
        //array to submit

        //console.log("form data thus far ", formData)
        var departureFormData = formData

            
        //sanitize and encode expected cruise
        if (depExpectedCruiseInput.value.length === 0){
            departureFormData.push({EXPECT_CRUISE:depExpectedCruiseInput.placeholder})
        } else {
            const sanitizedNotes = encodeURIComponent(depExpectedCruiseInput.value)
            departureFormData.push({EXPECT_CRUISE:sanitizedNotes})
        }


        //push airport ICAO 
        departureFormData.push({ICAO:airportICAO})
        departureFormData.push({PROCEDURE:"PROCEDURE"})

        //push date
        const currentDate = new Date();
        const formattedTimestamp = currentDate.toISOString();
        departureFormData.push({"UPDATED":formattedTimestamp})

        //console.log("departureFormData so far ", departureFormData)

        var token = localStorage.getItem('token');

        const mongoDeparturesAddURL = "https://zsebrief-backend-production.up.railway.app/departures" // PRODUCTION URL
        //const mongoDeparturesAddURL = "http://localhost:3000/departures" //TEST URL

        //reduce the array 

        //console.log("departure form data before reduction", departureFormData)

        const transformedDepartureFormData = departureFormData.reduce((result, item) => {
        const key = Object.keys(item)[0]; // Assuming each object has only one key
        const value = item[key];
        result[key] = value;
        return result;
        }, {});


        const fetchData = async () => {
                
        //console.log("data to send in put " , JSON.stringify(transformedDepartureFormData))
            fetch(`${mongoDeparturesAddURL}`, {
            method:'POST',
            body: JSON.stringify(transformedDepartureFormData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Set the Authorization header with the token
                },
            }).then(response=> response.json()
            ).then(data=>{
                if (data !== null) {
                    //console.log("returned data is ", JSON.stringify(data));
                    setAddedDeparture(true)
                    refreshPage()
                } else {
                    // console.log("No data returned from the server");
                    setAddedDeparture(false)
                }
                // eslint-disable-next-line no-unused-vars
            }).catch (error => {
            })
        }
        fetchData()

        //RETURN the departure by ID

        for (var i = 0; i < airportOverviewForm.elements.length; i++) {
            airportOverviewForm.elements[i].setCustomValidity('');
        }
    }
    //End handle departure add function


    // let departureICAO = departure.ICAO
    // let departureProcedure = departure.PROCEDURE
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
    
    let runwayListForm; 

    if (runwayList) {
        runwayListForm = runwayList.map((runway,index) =>{
            const runwaySelect = runway.RUNWAY
            return(
                <option key={index} value={runwaySelect}>{runwaySelect}</option>
            )
            })
    }


    return (
        <div>
            <div className='main-body'>
                <div className="sticky-header">
                    <Header />
                </div>
                <div className="details-margin-top">
                    <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button>Back to all details</button></Link>            
                    <Link to={`/details/${airportICAO}/departures`} state={{airportICAO}}> <button>Back to {airportICAO} departures</button></Link>
                </div>
                <div>
                <h3>Add new departure</h3>
                </div>
                <div>
                    <form id="departureAddForm" onSubmit = {handleDepartureAdd}>
                        <label>Last updated: {departureUpdated}</label><br></br>
                        <label>Updated by {departureUpdatedBy}</label><br></br>
                        <label>Name:  </label><input type="text" id="depName" size="15" placeholder={departureName} pattern="^[A-Za-z\s]*$" onChange={(event) => {handleDropDown(event, "NAME"); setPreviewName(event.target.value)}}/> &nbsp; Text only<br></br>
                        <label>Number: </label><input type="text" id="depNumber" size="1" placeholder={departureNum} pattern="[0-9]{0,2}" onChange={(event) => {handleDropDown(event, "NUM"); setPreviewNum(event.target.value)}}/><br></br>                        
                        <label>Type: </label>
                        <select id="depTypeOption" onChange={(event) => {handleDropDown(event, "TYPE"); setPreviewType(event.target.value),  buildPhraseology(event.target.value)}}>
                          <option value=""></option>
                            <option value="R/V">R/V</option>
                            <option value="R/V_NO_DEP">R/V_NO_DEP</option>
                            <option value="RNAV">RNAV</option>
                            <option value="ODP_NAMED">ODP_NAMED</option>
                            <option value="ODP_NOT_NAMED">ODP_NOT_NAMED</option>
                            <option value="RADIAL-TRANS">RADIAL-TRANS</option>
                        </select><br></br>
                        <label>Runway Specific: </label> 
                        <select id="depRwySpecific" value={previewDepRunway} onChange={(event) => {handleDropDown(event, "RUNWAY"); setPreviewDepRunway(event.target.value)}}>
                            <option value=""></option>
                            {runwayListForm}
                        </select><br></br>
                        <label>Top alt listed? </label>
                         <select id="depTopAltListed" value={previewTopAltListed} onChange={(event) => {handleDropDown(event, "TOP_ALT_LISTED"); setPreviewTopAltListed(event.target.value)}}>
                            <option value="NA"></option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select><br></br>
                        <label>Top alt (FT): </label><input type="text" id="depTopAlt" size="20" placeholder={departureTopAlt}  pattern="^[0-9]{0,5}$" onChange={(event) => {handleDropDown(event, "TOP_ALT"); setPreviewTopAlt(event.target.value)}}/> Thousands of feet with no comma: for example, 5k would be 5000.<br></br>                    
                        <label>Need for interim alt? </label>
                        <select id="depNeedForInterim" value={previewNeedForInterim} onChange={(event) => {handleDropDown(event, "NEED_FOR_INTERIM_ALT"); setPreviewNeedForInterim(event.target.value)}}>
                            <option value="NA"></option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select><br></br>
                        <label>Climb instruction: </label>
                        <select id="depClimbInstruction" value={previewClimbPhrase} onChange={(event) => {handleDropDown(event, "CLIMB"); setPreviewClimbPhrase(event.target.value)}}>
                            <option value=""></option>
                            <option value="MAINTAIN">MAINTAIN</option>
                            <option value="CLB VIA SID">CLB VIA SID</option>
                            <option value="CLB VIA SID, EXCEPT MAINTAIN">CLB VIA SID, EXCEPT MAINTAIN</option>
                        </select><br></br>
                        <label>Expect cruise: </label><input type="text" id="depExpectedCruise" size="20" placeholder={departureExpectCruise} onChange={(event) => {handleDropDown(event, "EXPECT_CRUISE"); setDepExpectedCruise(event.target.value)}}/> &nbsp; Free text (format # MINS AFT DEP or # NM FROM WAYPOINT)<br></br>      
                        <br></br>
                        <button type="submit">Submit</button>
                        <p></p>  
                    </form>
                </div>
                {addedDeparture ===true  && <p>Success: new departure has been created!</p>}
                <div className="phraseologyPreview">
                        <p className="headerText">Phraseology Preview</p>
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
                                <tr> 
                                <td>{previewType}</td>    
                                <td>{previewPhrase}</td>
                                <td>{previewClimbPhrase}</td>
                                <td>{previewTopAlt} {previewTopAltListed === "YES" && <span>(Don't state)</span>}</td>
                                <td>{depExpectedCruise}</td>
                            </tr>
                            </tbody>
                        </table>
                </div>
            </div>
            <div className="footer">
                    <Footer/> 
            </div> 
        </div>
    )
}

