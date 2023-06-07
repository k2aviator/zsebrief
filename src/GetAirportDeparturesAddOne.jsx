import React, { useState, useEffect } from 'react';
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
    const [previewType, setPreviewType] = useState()
    const [previewPhrase, setPreviewPhrase] = useState()
    const [previewTopAlt, setPreviewTopAlt] = useState()
    const [previewClimbPhrase, setPreviewClimbPhrase] = useState()
    const [previewExpectedCruise, setPreviewExpectedCruise] = useState()

    //Departure Phraseology Preview Function
    let depType;
    let depName;
    let depNumber;
    let depTopAlt;
    let depClimbIns;
    let depExectedCruise;

    useEffect(() => {
        function handlePhraseologyBuilder(event, fieldName) {
          const value = event.target.value;
          // Handle the input change here, including the field name
          if (fieldName === "depType"){
            depType = value;
        //     console.log("in function dep type", depType);
         } else if (fieldName === "depName") {
            depName = value;
          } else if (fieldName === "depNumber") {
            depNumber = value;
          } else if (fieldName === "depTopAlt") {
            depTopAlt = value;
          } else if (fieldName === "depClimbIns") {
            depClimbIns = value;
          } else if (fieldName === "depExpectedCruise") {
            depExectedCruise = value;
          }
          const [clearPhrase, climbPhrase] = depPhraseology(depType, depName, depNumber, depTopAlt)
          setPreviewPhrase(clearPhrase)
          setPreviewTopAlt(climbPhrase)
          setPreviewClimbPhrase(depClimbIns)
          setPreviewType(depType)
          setPreviewExpectedCruise(depExectedCruise)
        }
        

        function addEventListenersWhenLoaded() {
          const inputElementIds = ['depType', 'depName', 'depNumber', 'depTopAlt', 'depClimbIns', 'depExpectedCruise'];
          inputElementIds.forEach((inputElementId) => {
            const inputElement = document.getElementById(inputElementId);
            if (inputElement) {
              inputElement.addEventListener('input', (event) => handlePhraseologyBuilder(event, inputElementId));
            } else {
              setTimeout(addEventListenersWhenLoaded, 100); // Retry after a short delay if the element is not available yet
            }
          });
        }
      
        addEventListenersWhenLoaded();
      
        return () => {
          const inputElementIds = ['depType', 'depName', 'depNumber', 'depTopAlt', 'depRwySpecific'];
          inputElementIds.forEach((inputElementId) => {
            const inputElement = document.getElementById(inputElementId);
            if (inputElement) {
              inputElement.removeEventListener('input', (event) => handlePhraseologyBuilder(event, inputElementId));
            }
          });
        };
      }, []);
    
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

        var departureFormData = []

        //validate departure name
        var depNameValid = /^[A-Za-z\s]*$/.test(depNameInput.value);
            if (!depNameValid) {
                depNameInput.setCustomValidity('Enter only letters');
                depNameInput.reportValidity();
                return false;
            } else {
                depNameInput.setCustomValidity('');
                if (depNameInput.value.length === 0){
                    departureFormData.push({"NAME":depNameInput.placeholder})
                } else {
                    departureFormData.push({"NAME":depNameInput.value})
                }

            }

        //validate number
        var depNumberValid = /^[0-9]{0,2}$/.test(depNumberInput.value);
            if (!depNumberValid) {
                depNumberInput.setCustomValidity('Enter B, C, D, or E');
                return false;
            } else {
                depNumberInput.setCustomValidity('');
                if (depNumberInput.value.length === 0){
                    //console.log("no field entered, use placeholder value")
                    departureFormData.push({"NUM":depNumberInput.placeholder})
                } else {
                    //console.log("use stored value")
                    departureFormData.push({"NUM":depNumberInput.value})
                }
            }

    
        // validate type
        var depTypeValid = /^(|R\/V|R\/V_NO_DEP|RNAV|ODP_NAMED|ODP_NOT_NAMED|RADIAL-TRANS)*$/i.test(depTypeInput.value);
            if (!depTypeValid)  {
                depTypeInput.setCustomValidity('Enter TRUE or FALSE');
                return false;
            } else {
                depTypeInput.setCustomValidity('');
                if (depTypeInput.value.length === 0){
                    //console.log("no field entered, use placeholder value")
                    departureFormData.push({TYPE:depTypeInput.placeholder})
                } else {
                    //console.log("use stored value")
                    const depTypeValue = depTypeInput.value
                    departureFormData.push({TYPE: depTypeValue})
                }
                
                
            }


        // validate runway specific
            var depRwyValid = /^[A-Za-z0-9]{0,3}$/i.test(depRwySpecificInput.value);
            if (!depRwyValid)  {
                depRwySpecificInput.setCustomValidity('Enter R/V, R/V_NO_DEP, RNAV, ODP_NAMED, ODP_NOT_NAMED, OR RADIAL-TRANS');
                return false;
            } else {
                depRwySpecificInput.setCustomValidity('');
                if (depRwySpecificInput.value.length === 0){
                    //console.log("no field entered, use placeholder value")
                    departureFormData.push({RWY_SPECIFIC:depRwySpecificInput.placeholder})
                } else {
                    //console.log("use stored value")
                    const depRwyValue = depRwySpecificInput.value
                    departureFormData.push({RWY_SPECIFIC: depRwyValue})
                }
            }


        // validate top altitude
        var depTopAltListedValid = /^(|YES|NO)$/i.test(depTopAltListedInput.value);
        if (!depTopAltListedValid)  {
            depTopAltListedInput.setCustomValidity('Enter YES or NO');
            return false;
        } else {
            depTopAltListedInput.setCustomValidity('');
            if (depTopAltListedInput.value.length === 0){
                //console.log("no field entered, use placeholder value")
                departureFormData.push({TOP_ALT_LISTED:depTopAltListedInput.placeholder})
            } else {
                //console.log("use stored value")
                const depTopAltListedValue = depTopAltListedInput.value
                departureFormData.push({TOP_ALT_LISTED: depTopAltListedValue})
            }
        }

        // validate top alt
        var depTopAltValid = /^[0-9]{0,5}$/i.test(depTopAltInput.value);
        if (!depTopAltValid)  {
            depTopAltInput.setCustomValidity('Display in thousands of feet with no comma: for example, 5k would be 5000');
            return false;
        } else {
            depTopAltInput.setCustomValidity('');
            if (depTopAltInput.value.length === 0){
                //console.log("no field entered, use placeholder value")
                departureFormData.push({TOP_ALT:depTopAltInput.placeholder})
            } else {
                //console.log("use stored value")
                const depTopAltValue = depTopAltInput.value
                departureFormData.push({TOP_ALT: depTopAltValue})
            }
        }
        
        // validate interim alt
        var depInterimAltValid = /^(|YES|NO)$/i.test(depInterimAltInput.value);
        if (!depInterimAltValid)  {
            depInterimAltInput.setCustomValidity('Options: YES, NO, or leave empty');
            return false;
        } else {
            depInterimAltInput.setCustomValidity('');
            if (depInterimAltInput.value.length === 0){
                //console.log("no field entered, use placeholder value")
                departureFormData.push({NEED_FOR_INTERIM_ALT:depInterimAltInput.placeholder})
            } else {
                //console.log("use stored value")
                const depInterimAltValue = depInterimAltInput.value
                departureFormData.push({NEED_FOR_INTERIM_ALT: depInterimAltValue})
            }
        }
        

        // validate climb instructions
        var depClimbInsValid = /^(|MAINTAIN|CLB VIA SID|CLB VIA SID, EXCEPT MAINTAIN)$/i.test(depClimbInsInput.value);
        if (!depClimbInsValid)  {
            depClimbInsInput.setCustomValidity('Options: YES, NO, or leave empty');
            return false;
        } else {
            depClimbInsInput.setCustomValidity('');
            if (depClimbInsInput.value.length === 0){
                //console.log("no field entered, use placeholder value")
                departureFormData.push({CLIMB:depClimbInsInput.placeholder})
            } else {
                //console.log("use stored value")
                const depClimbInsValue= depClimbInsInput.value
                departureFormData.push({CLIMB: depClimbInsValue})
            }
        }
        
            
        //sanitze and encode expected cruise
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
                        <label>Name:  </label><input type="text" id="depName" size="15" placeholder={departureName} pattern="^[A-Za-z\s]*$"/> &nbsp; Text only<br></br>
                        <label>Number: </label><input type="text" id="depNumber" size="1" placeholder={departureNum} pattern="[0-9]{0,2}"/><br></br>
                        <label>Type: </label><input type="text" id="depType" size="4" placeholder={departureType} pattern="^(R/V|R/V_NO_DEP|RNAV|ODP_NAMED|ODP_NOT_NAMED|RADIAL-TRANS)$" /> &nbsp; Options: R/V, R/V_NO_DEP, RNAV, ODP_NAMED, ODP_NOT_NAMED, OR RADIAL-TRANS<br></br>
                        <label>Runway Specific: </label><input type="text" id="depRwySpecific" size="2" placeholder={departureRunway} pattern ="^[A-Za-z0-9]{0,3}$"/> &nbsp; If runway specific, enter runway (e.g, 16L, 14, 2)<br></br>
                        <label>Top alt listed?  </label><input type="text" id="depTopAltListed" size="2" placeholder={departureTopAltListed} pattern="^(|YES|NO)$" /> &nbsp; Options: YES, NO, or leave empty<br></br>
                        &nbsp;<br></br>
                        <label>Top alt (FT): </label><input type="text" id="depTopAlt" size="20" placeholder={departureTopAlt}  pattern="^[0-9]{0,5}$"/> <br></br> Thousands of feet with no comma: for example, 5k would be 5000. If "TOP ALT" is listed on the chart, include "(DON'T STATE)" after altitude. For example, "5000 (DON'T STATE)"<br></br>                        
                        &nbsp;<br></br>                     
                        <label>Need for interim alt? </label><input type="text" id="depInterimAlt" size="2" placeholder={departureNeedForInterim} pattern="^(|YES|NO)$" /> &nbsp; Options: YES, NO, or leave empty<br></br>
                        <label>Climb instruction: </label><input type="text" id="depClimbIns" size="20" placeholder={departureClimb} pattern="^(|MAINTAIN|CLB VIA SID|CLB VIA SID, EXCEPT MAINTAIN)$"/> &nbsp; Options: "MAINTAIN", "CLB VIA SID", "CLB VIA SID, EXCEPT MAINTAIN", or empty<br></br>
                        <label>Expect cruise: </label><input type="text" id="depExpectedCruise" size="20" placeholder={departureExpectCruise} /> &nbsp; Free text (format # MINS AFT DEP or # NM FROM WAYPOINT)<br></br>      
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
                                <td>{previewTopAlt}</td>
                                <td>{previewExpectedCruise}</td>
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

