import React, { useState, useEffect  } from 'react';
import GetAirportRunways from './GetAirportRunways'
import GetAirportDepartures from './GetAirportDepartures'
import { Link } from 'react-router-dom';


//https://blog.openreplay.com/creating-a-collapsible-component-for-react/
//Expand and collapse airports
export default function GetAirportDetails({airportICAO, airportName, airportTowered, airportHoursOpen, airportHoursClose, airspaceClass, airportElev, pstTime}) {  
    //console.log(airportState)
    const [open, setOpen] = useState(false)
    const [airportOpen,setAirportOpen] = useState(false)
    const [airportLogo,setAirportLogo] = useState(false)
    const [towerOpen, setTowerOpen] = useState(false)
    const hostName = window.location.hostname;

    const images = require.context('./logos-airports', false, /\.(png|jpe?g|svg)$/);

    const imageFiles = images.keys().map((path) => {
    const src = images(path);
    const filename = path.replace('./', '');

     return { filename, src };});

     const [isAdminRole, setIsAdminRole] = useState('false')
     var token = localStorage.getItem('token');
     //console.log("run is admin function... token is ", token)
     const mongoIsAdminURL = "https://zsebrief-backend-production.up.railway.app/login/isadmin" //PROD URL
     //const mongoIsAdminURL = "http://localhost:3000/login/isadmin" //TEST URL
        
     useEffect(() => {
         const fetchData = async () => {
             
             fetch(mongoIsAdminURL, {
             method:'POST', 
             headers:  {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Set the Authorization header with the token
                 },
             }).then(response=> response.json()
             ).then(data=>{
                 //console.log("returned data is ", data.admin)
                 const isAdmin = data.admin
                 setIsAdminRole(isAdmin)
             }).catch (error => {
             })
         }
         fetchData()
 
     }, [token]);

    var dataLayer = window.dataLayer = window.dataLayer || [];

    const toggleOpen = () =>{
        setOpen(!open);
        //console.log(airportICAO, airportName, airportTowered, airportHoursOpen, airspaceClass)
        //console.log("clicked on airport expand")
        dataLayer.push({
            'event': 'vpv',     
            'vpv_page_path':`http://${hostName}/vpv/${airportICAO}-details` ,
            'vpv_page_location': `/vpv/${airportICAO}-details`,
            'vpv_page_title': `${airportICAO} | ${airportName}` ,
            'vpv_hostname': hostName
          });
        

        airportImage(airportICAO)
    
        isTowerOpen()
        if( airportTowered === "TRUE"){
            setAirportOpen(!airportOpen)
    
        }
    }

    const airportImage = (airportICAO)=>{
        //console.log("airport image function")
        let codePng = `${airportICAO}.png`
        const indexMatch = imageFiles.findIndex(obj => codePng === obj.filename)   
        //console.log("does the index match?", indexMatch)
        if (indexMatch !== -1){
            //console.log(imageFiles[indexMatch].src)
            setAirportLogo(!airportLogo)
        } 
    }

    const airportImageLoc = (airportICAO)=>{
        let codePng = `${airportICAO}.png`
        const indexMatch = imageFiles.findIndex(obj => codePng === obj.filename)
        return imageFiles[indexMatch].src   
     }

    const isTowerOpen = ()=>{
        if (airportHoursOpen === 2359){
            setTowerOpen("TWR OPEN")
        }
        else if (parseInt(pstTime) > airportHoursOpen) {
            if (parseInt(pstTime) < airportHoursClose){
                // console.log(airportICAO, "OPEN")
                // console.log("time now is ", pstTime)
                // console.log("airport opens at ", airportHoursOpen, " and closes at", airportHoursClose)
                setTowerOpen("TWR OPEN")
            } else {
                // console.log(airportICAO, "CLOSED")
                // console.log("time now is ", pstTime)
                // console.log("airport opens at ", airportHoursOpen, " and closes at", airportHoursClose)
                setTowerOpen("TWR CLOSED")
            }
        }
    }

    const displayHours = (hours) =>{
        hours = hours.toString()
        // console.log(hours)
        // console.log("function hours ", hours)
        if (hours.length === 3 ){
            // console.log("airport hours length ", hours.length)
            return `0${hours}`
        } else {
            // console.log("airport hours length ", hours.length)
            return hours
        }
    }

    // console.log("airport open hours", airportHoursOpen)
    // console.log("pst time ", parseInt(pstTime))

    const setTowerStatus = (towerOpen)=>{
        if (towerOpen === "TWR OPEN"){
            return "towerOpen"
        } else {
            return "towerClosed"
        }
    }


    const roundElevation = (number)=>{
        return Math.ceil(number /100) * 100 + 1000;
    }





    

    // const imageDisplay = imageFiles[4].src
    return (
        <div className="airport-details-box">
            <div className="airport-code-name" onClick={()=>toggleOpen()}>
                <div id="airportName" >
                    <button className="button">{airportICAO} | {airportName} </button>
                    {open && <div className="collapsible-expand">
                        <div className="airport-status-logos" > 
                           
                            <div className="airport-status"> 
                            {airportOpen &&  
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className={setTowerStatus(towerOpen)}>{towerOpen}</td>
                                        <td>{displayHours(airportHoursOpen)}-{airportHoursClose} (time now {pstTime})</td>
                                    </tr>
                                </tbody>
                             </table>
                             
                            }
                            <div> 
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Airspace:</td>
                                                <td>{airspaceClass}</td>
                                            </tr>
                                            <tr>
                                                <td>Elev:</td>
                                                <td>{airportElev}</td>
                                            </tr>
                                            <tr>
                                                <td>Pattern Alt:</td>
                                                <td>{roundElevation(airportElev)} (turbine: {roundElevation(airportElev)+500})</td>
                                            </tr>
                                        </tbody>
                                    </table>
                            </div>
                            </div>
                            
                            {airportLogo &&
                              <div className="airport-logos">
                                        <img alt="airport logo" src={airportImageLoc(airportICAO)}></img>
                             </div>
                          }
                        </div>
                            
              
           
                            <GetAirportRunways airportICAO={airportICAO}/>
                            <p></p>
                            <GetAirportDepartures airportICAO={airportICAO}/>
                            <p></p>
                        <div>
                            <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button>View All Airport Details</button></Link><br></br>
                            {isAdminRole && <div>
                            <Link to={`/details/${airportICAO}/overview`} state={{airportICAO}}> <button>Edit General Airport Information</button></Link><br></br>
                            <Link to={`/details/${airportICAO}/runways`} state={{airportICAO}}> <button>Edit Runway Information</button></Link><br></br>
                            <Link to={`/details/${airportICAO}/departures`} state={{airportICAO}}> <button>Edit Departure Information</button></Link><br></br>
                             </div>}
                        </div>
                           
                    </div>}
                </div> 
            </div>
        </div>
    )

}

GetAirportDetails.propTypes = {
}