import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { depPhraseology } from './utilDepPhraseology'
import UtilAdminRole from './UtilAdminRole';
import Header from './Header';
import Footer from './Footer'

export default function GetAirportDeparturesEditOne() {  
    const navigate = useNavigate()
    // eslint-disable-next-line no-unused-vars
    const isAdminRole = UtilAdminRole()
    var token = localStorage.getItem('token')
    const location = useLocation()
    const routerLocation = useLocation();
    const { airportICAO, departureId } = routerLocation.state;
    const [departure, setDeparture] = useState([])
    const [updatedDeparture, setUpdatedDeparture] = useState(false)
    const [departureDeleted, setDepartureDeleted] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [previewType, setPreviewType] = useState()
    const [previewPhrase, setPreviewPhrase] = useState()
    const [previewTopAlt, setPreviewTopAlt] = useState()
    const [previewTopAltListed, setPreviewTopAltListed] = useState()
    const [previewClimbPhrase, setPreviewClimbPhrase] = useState()
    const [previewNeedForInterim, setPreviewNeedForInterim] = useState()
    const [previewExpectedCruise, setPreviewExpectedCruise] = useState();

    //FORM Interactive Elements
    const [depTypeOption, setDepTypeOption] = useState('');
    const [icaoTowered, setIcaoTowered] = useState('');
    const [formData, setFormData] = useState([])


    //HANDLE DROP DOWN FUNCTIONALITY
    const handleDropDown = (event, keyName) => {
        const key = keyName;
        const value = event.target.value;
        const existingKeyValuePair = formData.find((item) => Object.prototype.hasOwnProperty.call(item,key));
        if (existingKeyValuePair) {
            // Update the existing key-value pair
            existingKeyValuePair[key] = value;
            setFormData([...formData]);
            } else {
            // Add a new key-value pair to the array
            setFormData(prevData => [...prevData, { [key]: value }]);
            }
    }    

    function backToAirportOverview({airportICAO}) {

        setTimeout(() => {
            setDepartureDeleted(true)
            navigate(`/details/${airportICAO}/departures`,{state: { airportICAO }})
         }, 2000); // Refresh after 3 seconds (3000 milliseconds)
    }

    function refreshPage() {
        setTimeout(() => {
            navigate(`/details/${airportICAO}/departures`,{state: { airportICAO }})
         }, 2000); // Refresh after 3 seconds (3000 milliseconds)
    }
        
    
    //Departure Phraseology Preview Function
    let depType;
    let depName;
    let depNumber;
    let depTopAlt;
    let depClimbIns;
    let depExpectedCruise;

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
            depExpectedCruise = value;
          }
          const [clearPhrase, climbPhrase] = depPhraseology(depType, depName, depNumber, depTopAlt)
          setPreviewPhrase(clearPhrase)
          setPreviewTopAlt(climbPhrase)
          setPreviewClimbPhrase(depClimbIns)
          setPreviewType(depType)
          setPreviewExpectedCruise(depExpectedCruise)
          
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


    //MONGO DB GET DEPARTURES
    const mongoDepartureURL = "https://zsebrief-backend-production.up.railway.app/departures" //PRODUCTION
    //const mongoDepartureURL = "http://localhost:3000/departures" //TEST

    //MONGO DB GET BY DEPARTURE ID
    const mongoDepartureById = `https://zsebrief-backend-production.up.railway.app/departures/${departureId}`//PRODUCTION
    //const mongoDepartureById = `http://localhost:3000/departures/${departureId}`//TEST
    useEffect(()=>{
    fetch(mongoDepartureById)
    .then(response => response.json())
    .then((data) => {
        setDeparture(data);
        setPreviewType(data.TYPE)
        setPreviewClimbPhrase(data.CLIMB)
        setPreviewTopAltListed(data.TOP_ALT_LISTED)
        setPreviewExpectedCruise(decodeURIComponent(data.EXPECT_CRUISE))
        setPreviewNeedForInterim(data.NEED_FOR_INTERIM_ALT)
        let [clearPhrase, climbPhrase] = depPhraseology(data.TYPE, data.NAME, data.NUM, data.TOP_ALT)
        setPreviewPhrase(clearPhrase)
        setPreviewTopAlt(climbPhrase)
        setIsLoading(false);   
        },
        (error)=>{
            console.log(error)
            setIsLoading(false);
            setHasError(true);
        })  
    }, [departureId, depType, depName, depNumber, depTopAlt])


    const handleDepartureDelete = (event, departureId)=>{
        event.preventDefault();
        console.log("delete function")
        const idToDelete = departureId.departureId
        console.log("departure ID is ", idToDelete)

        fetch(`${mongoDepartureURL}/${idToDelete}`, {
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Set the Authorization header with the token
                },
            }).then(response=> response.json()
            ).catch (error => {
                console.error('An error occurred:', error);
            })
        
        setDepartureDeleted(true)
        backToAirportOverview({airportICAO})
    }

     //BEGIN HANDLE DEPARTURE OVERVIEW EDIT/SUBMIT 

    const handleDepartureEdit = (event)=>{
        
        event.preventDefault();
        var airportOverviewForm = document.getElementById('departureEditForm');

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

        var departureFormData = formData;

        // console.log("departure form data", departureFormData)
        
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

        const mongoDeparturesURL = "https://zsebrief-backend-production.up.railway.app/departures" // PRODUCTION URL
        //const mongoDeparturesURL = "http://localhost:3000/departures" //TEST URL

        //reduce the array 

        const transformedDepartureFormData = departureFormData.reduce((result, item) => {
        const key = Object.keys(item)[0]; // Assuming each object has only one key
        const value = item[key];
        result[key] = value;
        return result;
        }, {});


        const fetchData = async () => {
                
        //console.log("data to send in put " , JSON.stringify(transformedDepartureFormData))
            fetch(`${mongoDeparturesURL}/${departureId}`, {
            method:'PUT',
            body: JSON.stringify(transformedDepartureFormData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Set the Authorization header with the token
                },
            }).then(response=> response.json()
            ).then(data=>{
                if (data !== null) {
                    //console.log("returned data is ", JSON.stringify(data));
                    setUpdatedDeparture(true)
                    refreshPage()
                } else {
                    // console.log("No data returned from the server");
                    setUpdatedDeparture(false)
                }
            }).catch (error => {
                console.error('An error occurred:', error);
            })
        }
        fetchData()

        //RETURN the departure by ID

        for (var i = 0; i < airportOverviewForm.elements.length; i++) {
            airportOverviewForm.elements[i].setCustomValidity('');
        }
        }
     //END HANDLE DEPARTURE OVERVIEW EDIT/SUBMIT 

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
                    <Link to={`/details/${airportICAO}/departures`} state={{airportICAO}}> <button>Back to {airportICAO} departures</button></Link>
                </div>
                <div>
                <h3>Edit {airportICAO} {departureType} departure </h3>
                <h4>{departureName} {departureNum}</h4>
                </div>
                <div>
                    <form id="departureEditForm" onSubmit = {handleDepartureEdit}>
                        <label>Last updated: {departureUpdated}</label><br></br>
                        <label>Updated by {departureUpdatedBy}</label><br></br>
                        <label>Database id: {departureId}</label><br></br>
                        <label>Name:  </label><input type="text" id="depName" size="15" placeholder={departureName} pattern="^[A-Za-z\s]*$"/> &nbsp; Text only<br></br>
                        <label>Number: </label><input type="text" id="depNumber" size="1" placeholder={departureNum} pattern="[0-9]{0,2}"/><br></br>
                        <label>Type: </label>
                        <select id="depTypeOption" value={previewType} onChange={(event) => {handleDropDown(event, "TYPE"); setPreviewType(event.target.value)}}>
                            <option value="R/V">R/V</option>
                            <option value="R/V_NO_DEP">R/V_NO_DEP</option>
                            <option value="RNAV">RNAV</option>
                            <option value="ODP_NAMED">ODP_NAMED</option>
                            <option value="ODP_NOT_NAMED">ODP_NOT_NAMED</option>
                            <option value="RADIAL-TRANS">RADIAL-TRANS</option>
                        </select><br></br>
                        <label>Runway Specific: </label><input type="text" id="depRwySpecific" size="2" placeholder={departureRunway} pattern ="^[A-Za-z0-9]{0,3}$"/> &nbsp; If runway specific, enter runway (e.g, 16L, 14, 2)<br></br>
                        <label>Top alt listed? </label>
                         <select id="depTopAltListed" value={previewTopAltListed} onChange={(event) => {handleDropDown(event, "TOP_ALT_LISTED"); setPreviewTopAltListed(event.target.value)}}>
                            <option value="NA"></option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select><br></br>
                        <label>Top alt (FT): </label><input type="text" id="depTopAlt" size="20" placeholder={departureTopAlt}  pattern="^[0-9]{0,5}$"/> <br></br> Thousands of feet with no comma: for example, 5k would be 5000. If "TOP ALT" is listed on the chart, include "(DON'T STATE)" after altitude. For example, "5000 (DON'T STATE)"<br></br>                        
                        &nbsp;<br></br>
                        <label>Need for interim alt? </label>
                        <select id="depNeedForInterim" value={previewNeedForInterim} onChange={(event) => {handleDropDown(event, "NEED_FOR_INTERIM_ALT"); setPreviewNeedForInterim(event.target.value)}}>
                            <option value="NA"></option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select><br></br>
                        <label>Climb instruction: </label>
                        <select id="depClimbInstruction" value={previewClimbPhrase} onChange={(event) => {handleDropDown(event, "CLIMB"); setPreviewClimbPhrase(event.target.value)}}>
                            <option value="MAINTAIN">MAINTAIN</option>
                            <option value="CLB VIA SID">CLB VIA SID</option>
                            <option value="CLB VIA SID, EXCEPT MAINTAIN">CLB VIA SID, EXCEPT MAINTAIN</option>
                        </select><br></br>
                        <label>Expect cruise: </label><input type="text" id="depExpectedCruise" size="20" placeholder={departureExpectCruise} /> &nbsp; Free text (format # MINS AFT DEP or # NM FROM WAYPOINT)<br></br>      
                        <br></br>
                        <button type="submit">Submit</button>{updatedDeparture ===true  && <p>Success: departure has been updated.</p>}
                        <p></p>  
                    </form>
                </div>
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
                <div>
                    &nbsp;<br></br>
                    &nbsp;<br></br>
                    &nbsp;<br></br>
 
                    Caution: &nbsp; 
                    <button onClick={(event) => handleDepartureDelete(event, {departureId}, {departureName})}>&nbsp;Delete departure</button>{departureDeleted ===true  && <p>Success: departure deleted.</p>}
                    &nbsp;<br></br>
                    &nbsp;<br></br>
                    &nbsp;<br></br>
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

