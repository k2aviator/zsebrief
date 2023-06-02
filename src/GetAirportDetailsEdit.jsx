import React, { useState, useEffect } from 'react';

export default function GetAirportDetailsEdit({airportICAO}) {  
    const [airports, setAirports] = useState([])
    const [updatedAirport, setUpdatedAirport] = useState(false)
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function refreshPage() {
        setTimeout(() => {
          window.location.reload(); // Reload the current page
        }, 2000); // Refresh after 3 seconds (3000 milliseconds)
      }


    //MONGO DB GET AIRPORTS
    const mongoAirportsURL = "https://zsebrief-backend-production.up.railway.app/airports"
    useEffect(()=>{
    fetch(mongoAirportsURL)
    .then(response => response.json())
    .then((data) => {
        setAirports(data);
        setIsLoading(false);   
        },
        (error)=>{
            console.log(error)
            setIsLoading(false);
            setHasError(true);
        })  
    }, [])

    //filter for airport selected
    const varAirportSelected = airports.filter(function(airports) {
        return airports.ICAO === airportICAO;
    })   

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

    //clear validity statements
    //array to submit

    var overviewFormData = []

    //validate elev
    var elevValid = /^\d{0,5}$/.test(elevInput.value);
        if (!elevValid) {
            elevInput.setCustomValidity('Enter only digits with no commas or text; max number of digits is 5');
            return false;
        } else {
            elevInput.setCustomValidity('');
            if (elevInput.value.length === 0){
                overviewFormData.push({"ELEV":elevInput.placeholder})
            } else {
                overviewFormData.push({"ELEV":elevInput.value})
            }

        }

    //validate airspace class
    var classValid = /^(B|C|D|E){0,1}$/.test(classInput.value);
    // console.log("airspace class ", classInput.value, " is valid? ", classValid)
        if (!classValid) {
            classInput.setCustomValidity('Enter B, C, D, or E');
            return false;
        } else {
            classInput.setCustomValidity('');
            if (classInput.value.length === 0){
                //console.log("no field entered, use placeholder value")
                overviewFormData.push({"AIRSPACE_CLASS":classInput.placeholder})
            } else {
                //console.log("use stored value")
                overviewFormData.push({"AIRSPACE_CLASS":classInput.value})
            }
            
            
        }
    
    //validate towered
    var toweredValid = /^(TRUE|FALSE){0,1}$/i.test(toweredInput.value);
    //console.log("towered ", toweredInput.value, " is valid? ", toweredValid)
        if (!toweredValid) {
            toweredInput.setCustomValidity('Enter TRUE or FALSE');
            return false;
        } else {
            toweredInput.setCustomValidity('');
            if (toweredInput.value.length === 0){
                //console.log("no field entered, use placeholder value")
                overviewFormData.push({"TOWERED":toweredInput.placeholder})
            } else {
                //console.log("use stored value")
                const toweredValue = toweredInput.value
                overviewFormData.push({TOWERED: toweredValue})
            }
            
            
        }

    //validate hours open and hours closed
    if (toweredInput.value === "TRUE" || toweredInput.placeholder === "TRUE") {
        
        if (openInput.value.length === 0){
            // console.log("no field entered, use placeholder value")
            overviewFormData.push({"HRS_OPEN":openInput.placeholder})
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
            console.log("no field entered, use placeholder value")
            overviewFormData.push({"HRS_CLOSE":closedInput.placeholder})
        } else {
            var closedValid = /^\d{4}$/.test(closedInput.value);
            console.log("closed valid is ", closedValid)
            if (!closedValid) {
                closedInput.setCustomValidity('Enter time in 4 digit format (HHMM)');
                return false;
            } else {
                closedInput.setCustomValidity('');
                overviewFormData.push({"HRS_CLOSE":closedInput.value})
            }
        }

    } else {
        overviewFormData.push({"HRS_OPEN":"NA"})
        overviewFormData.push({"HRS_CLOSE":"NA"})
    }


    //sanitize notes field

    const sanitizedNotes = encodeURIComponent(notesInput.value)
    overviewFormData.push({"NOTES":sanitizedNotes})

    //push airport ICAO 
    overviewFormData.push({"ICAO":airportICAO})

    //submit date (doing this in the backend instead - 5/31/23)
    const currentDate = new Date();
    const formattedTimestamp = currentDate.toISOString();
    overviewFormData.push({"UPDATED":formattedTimestamp})

    //show array to be pushed
    //console.log("array to submit to MONGODB ", overviewFormData)

    //submit to mongo DB
    //mongo expects:
    //PUT request pointing towards /airports/:CODE
    //token in req.headers.authorization
    //airport details in request body
    var token = localStorage.getItem('token');
    //console.log("token is ", token)

    //const mongoAirportURL = "https://zsebrief-backend-production.up.railway.app/airports" // PRODUCTION URL
    const mongoAirportURL = "http://localhost:3000/airports" //TEST URL
    // let mongoUrlFetch = `${mongoAirportURL}${mongoAirportToken}`


    //reduce the array 

    const transformedOverviewFormData = overviewFormData.reduce((result, item) => {
    const key = Object.keys(item)[0]; // Assuming each object has only one key
    const value = item[key];
    result[key] = value;
    return result;
    }, {});


    const fetchData = async () => {
             
       //console.log("data to send in put " , JSON.stringify(transformedOverviewFormData))
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
                refreshPage()
              } else {
                console.log("No data returned from the server");
                setUpdatedAirport(false)
              }
        }).catch (error => {
        })
    }
    fetchData()

    //RETURN is the updated airport


    for (var i = 0; i < airportOverviewForm.elements.length; i++) {
        airportOverviewForm.elements[i].setCustomValidity('');
      }
    }


    const airportList = varAirportSelected.map((airport,index) =>{
        let airportICAO = airport.ICAO
        let airportName = airport.NAME
        let airportTowered = airport.TOWERED
        let airportHoursOpen = airport.HRS_OPEN
        let airportHoursClose = airport.HRS_CLOSE
        let airportClass = airport.AIRSPACE_CLASS
        let airportElev = airport.ELEV
        let airportNotes = decodeURIComponent(airport.NOTES)
        let airportUpdated = airport.UPDATED
        let airportUpdatedBy = airport.UPDATED_BY
        return(
            <div key={index}>
                    <form id="airportOverviewForm" onSubmit = {handleAirportOverviewSubmit}>
                        <label><b>{airportICAO}: {airportName}</b></label><br></br>
                        <label>Last updated {airportUpdated}</label><br></br>
                        <label>Updated by {airportUpdatedBy}</label><br></br>
                        <label>Elevation: </label><input type="text" id="airportElev" size="1" placeholder={airportElev} pattern="[0-9]{0,5}"/><br></br>
                        <label>Airspace Class: </label><input type="text" id="airportClass" size="1" placeholder={airportClass} pattern="^(B|C|D|E)$"/> (Enter B, C, D, or E)<br></br>
                        <label>Towered: </label><input type="text" id="airportTowered" size="2" pattern="^(TRUE|FALSE)$" placeholder={airportTowered} /><br></br>
                        <label>Hour Open: </label><input type="text" id="airportHoursOpen" size="1" placeholder={airportHoursOpen} pattern="([0-9]{4}|[NA]{2})" /><br></br>
                        <label>Hour Closed: </label><input type="text" id="airportHoursClosed" size="1" placeholder={airportHoursClose} pattern="([0-9]{4}|[NA]{2})"/><br></br>
                        <label>Notes: </label><input type="text" id="airportNotes" size="40" placeholder={airportNotes} /><br></br>
                        <br></br>
                        <button type="submit">Submit</button>
                        <p></p>
                    </form>
                <div>
                    {updatedAirport ===true  && <p>Success: aiport details have been updated!</p>
        
                    }
                </div>
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
        <div> {airportList}
        </div>
    )

}

GetAirportDetailsEdit.propTypes = {
}