import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

export default function GetAirportDetailsEdit({airportICAO}) {  
    const [airports, setAirports] = useState([])
    const [updatedAirport, setUpdatedAirport] = useState(false)
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()
    
    //FORM Interactive Elements
    const [icaoClass, setIcaoClass] = useState('');
    const [icaoTowered, setIcaoTowered] = useState('');
    const [formData, setFormData] = useState([])

    const { themeName, toggleTheme } = useContext(ThemeContext)
    const buttonDark = themeName === "dark" ? 'button-dark' : '';
    
    setTimeout(() => {
        const icaoClassInput = document.getElementById("icaoClass")
        const icaoToweredInput = document.getElementById('icaoTowered')
        console.log(icaoClassInput)
      }, 500)
    

    //MONGO DB GET AIRPORTS

    const mongoAirportsURL = "https://zsebrief-backend-production.up.railway.app/airports"
    useEffect(()=>{
    fetch(`${mongoAirportsURL}/${airportICAO}`)
    .then(response => response.json())
    .then((data) => {
        setAirports(data);
        setIcaoClass(data.AIRSPACE_CLASS)
        setIcaoTowered(data.TOWERED)
        setFormData(prevData => [...prevData, {"ICAO":airportICAO}])
        setIsLoading(false);   
        },
        (error)=>{
            console.log(error)
            setIsLoading(false);
            setHasError(true);
        })  
    }, [])



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


    //BEGIN HANDLE AIRPORT OVERVIEW SUBMIT
    const handleAirportOverviewSubmit = (event)=>{
        
        event.preventDefault();
        var airportOverviewForm = document.getElementById('airportOverviewForm');

        //identify all form elements
        const elevInput = document.getElementById('airportElev')
        const classInput = document.getElementById('airportClass')
        const toweredInput = document.getElementById('airportTowered')
        const openInput = document.getElementById('airportHoursOpen')
        const closedInput = document.getElementById('airportHoursClosed')
        const notesInput = document.getElementById('airportNotes')

        var overviewFormData = formData;


        //validate elev
        var elevValid = /^\d{0,5}$/.test(elevInput.value);
        if (!elevValid) {
            elevInput.setCustomValidity('Enter only digits with no commas or text; max number of digits is 5');
            return false;
        } else {
            elevInput.setCustomValidity('');
            if (elevInput.value.length === 0){
                // setFormData(prevData => [...prevData, {"ELEV":elevInput.placeholder}])
            } else {
                overviewFormData.push({"ELEV":elevInput.value})
            }

        }
        //validate hours open and hours closed
        if (toweredInput.value === "TRUE" || toweredInput.placeholder === "TRUE") {
            
            if (openInput.value.length === 0){
                // console.log("no field entered, use placeholder value")
                // setFormData(prevData => [...prevData, {"HRS_OPEN":openInput.placeholder}])
            } else {
                var openValid = /^\d{4}$/.test(openInput.value);
                // console.log("open valid is ", openValid)
                if (!openValid) {
                    openInput.setCustomValidity('Enter time in 4 digit format (HHMM)');
                    return false;
                } else {
                    openInput.setCustomValidity('');
                    overviewFormData.push({"HRS_OPEN":openInput.value})
                }
            }

            if (closedInput.value.length === 0){
                //console.log("no field entered, use placeholder value")
                // setFormData(prevData => [...prevData, {"HRS_CLOSE":closedInput.placeholder}])
            } else {
                var closedValid = /^\d{4}$/.test(closedInput.value);
                //console.log("closed valid is ", closedValid)
                if (!closedValid) {
                    closedInput.setCustomValidity('Enter time in 4 digit format (HHMM)');
                    return false;
                } else {
                    closedInput.setCustomValidity('');
                    overviewFormData.push({"HRS_CLOSE":closedInput.value})
                }
            }

        } else {
            overviewFormData.push({"HRS_OPEN":''})
            overviewFormData.push({"HRS_CLOSE":''})
        }


        //sanitize notes field

        if (notesInput.value.length === 0){
            //console.log("no field entered, use placeholder value")
            // setFormData(prevData => [...prevData, {"NOTES":notesInput.placeholder}])
        } else {
            const sanitizedNotes = encodeURIComponent(notesInput.value)
            overviewFormData.push({"NOTES":sanitizedNotes})
        }


        //submit date (doing this in the backend instead - 5/31/23)
        const currentDate = new Date();
        const formattedTimestamp = currentDate.toISOString();
        overviewFormData.push({"UPDATED":formattedTimestamp})

        var token = localStorage.getItem('token');

        const mongoAirportURL = "https://zsebrief-backend-production.up.railway.app/airports" // PRODUCTION URL
        //const mongoAirportURL = "http://localhost:3000/airports" //TEST URL
        // let mongoUrlFetch = `${mongoAirportURL}${mongoAirportToken}`


        const transformedOverviewFormData = overviewFormData.reduce((result, item) => {
            const key = Object.keys(item)[0]; // Assuming each object has only one key
            const value = item[key];
            result[key] = value;
            return result;
            }, {});
    
     
        const fetchData = async () => {
                
        console.log("data to send in put " , JSON.stringify(transformedOverviewFormData))
            fetch(`${mongoAirportURL}/${airportICAO}`, {
            method:'PUT',
            body: JSON.stringify(transformedOverviewFormData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Set the Authorization header with the token
                },
            }).then(response=> response.json()
            ).then(data=>{
                if (data !== null) {
                    //console.log("returned data is ", JSON.stringify(data));
                    setUpdatedAirport(true)
                    setTimeout(() => {
                        navigate(`/details/${airportICAO}`, { state: { airportICAO } });
                        setUpdatedAirport(false) 
                      }, 2000); // Delay before redirection (2000 milliseconds)
    
                } else {
                    console.log("No data returned from the server");
                    setUpdatedAirport(false)
                }
            }).catch (error => {
            })
        }

        for (var i = 0; i < airportOverviewForm.elements.length; i++) {
            airportOverviewForm.elements[i].setCustomValidity('');
        }
        
        //RETURN is the updated airport
        fetchData()
    }
    //END HANDLE AIRPORT OVERVIEW SUBMIT

    let airportName = airports.NAME
    let airportTowered = airports.TOWERED
    let airportHoursOpen = airports.HRS_OPEN
    let airportHoursClose = airports.HRS_CLOSE
    let airportClass = airports.AIRSPACE_CLASS
    let airportElev = airports.ELEV
    let airportNotes = decodeURIComponent(airports.NOTES)
    let airportUpdated = airports.UPDATED
    let airportUpdatedBy = airports.UPDATED_BY

    if (isLoading) {
        return <p>loading...</p>
    }

    if (hasError) {
        return <p>Has error!</p>
    }


    return (
    <div>  
        <div>
            <form id="airportOverviewForm" onSubmit = {handleAirportOverviewSubmit}>
                <label><b>{airportICAO}: {airportName}</b></label><br></br>
                <label>Last updated {airportUpdated}</label><br></br>
                <label>Updated by {airportUpdatedBy}</label><br></br>
                <label>Elevation: </label><input type="text" id="airportElev" size="1" placeholder={airportElev} pattern="[0-9]{0,5}"/><br></br>
                <label>Airspace Class  </label>
                <select id="airspaceClass" value={icaoClass} onChange={(event) => {handleDropDown(event, "AIRSPACE_CLASS"); setIcaoClass(event.target.value)}}>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select><br></br>
                <label>Towered:  </label>
                <select id="airportTowered" value={icaoTowered} onChange={(event) => {handleDropDown(event, "TOWERED"); setIcaoTowered(event.target.value)}}>
                    <option value="TRUE">TRUE</option>
                    <option value="FALSE">FALSE</option>
                </select><br></br>
                {icaoTowered === "TRUE" &&
                <span>
                    <label>Hour Open: </label><input type="text" id="airportHoursOpen" size="1" placeholder={airportHoursOpen} pattern="([0-9]{4}|[NA]{2})" /><br></br>
                    <label>Hour Closed: </label><input type="text" id="airportHoursClosed" size="1" placeholder={airportHoursClose} pattern="([0-9]{4}|[NA]{2})"/><br></br>
                </span>
                }
                <label>Notes: </label><input type="text" id="airportNotes" size="40" placeholder={airportNotes} /><br></br>
                <br></br>
                <button type="submit" className={buttonDark}>Submit</button>
                <p></p>
            </form>
        </div>
        <div>
            {updatedAirport ===true  && <p id="success-message">Success: airport details have been updated!</p>}
        </div>
    </div>
    )
}