import React, { useState, useEffect, useContext  } from 'react';
import MobileGetAirportRunways from './MobileGetAirportRunways'
import MobileGetAirportDepartures from './MobileGetAirportDepartures'
import { Link } from 'react-router-dom';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'

//https://blog.openreplay.com/creating-a-collapsible-component-for-react/
//Expand and collapse airports
export default function MobileGetAirportDetails({airportICAO, airportName, airportTowered, airportHoursOpen, airportHoursClose, airspaceClass, airportElev, pstTime}) {  
    //console.log(airportState)
    const [open, setOpen] = useState(false)
    const [previouslyOpened, setPreviouslyOpened] = useState(null);
    const [airportOpen,setAirportOpen] = useState(false)
    const [airportLogo,setAirportLogo] = useState(false)
    const [towerOpen, setTowerOpen] = useState(false)
    const { themeName, toggleTheme } = useContext(ThemeContext)
    const buttonDark = themeName === "dark" ? 'button-dark' : '';

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

    const toggleCollapseAll = () =>{
        console.log("function")
        const allExpandedElements = document.querySelectorAll(`div[class^='collapsible-expand-${themeName}']`);
        // console.log("all expanded elements are ", allExpandedElements)
        allExpandedElements.forEach((element) => {
            element.classList.add("hidden");
        });

    }

    const toggleOpen = (divId) =>{
        toggleCollapseAll()
        // console.log("div id to close is ", divId)
        // console.log("open value is ", open)
        setOpen(!open);
        // setOpen((prevOpen) => (prevOpen === divId ? null : divId));
        // setOpen((prevOpen) => !prevOpen);
        // setPreviouslyOpened(null); // Close the previously opened div


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
        <div>
            <div className="airport-code-name" onClick={()=>toggleOpen(`airport-${airportICAO}`)}>
                <div id={`airport-${airportICAO}`} >
                    <button className={`button-airport-${themeName}`}>{airportICAO} </button>
                    {open && <div className={`collapsible-expand-${themeName}`}>
                        <div className="airport-status-logos" > 
                           
                            <div className={`airport-status-${themeName}`}> 
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
                            <div className={`airport-status-${themeName}`}>  
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
                            
                            {/* {airportLogo &&
                              <div className="airport-logos">
                                        <img alt="airport logo" className={`image-${themeName}`} src={airportImageLoc(airportICAO)}></img>
                             </div>
                          } */}
                        </div>
                            <MobileGetAirportRunways airportICAO={airportICAO}/>
                            <p></p>
                            <MobileGetAirportDepartures airportICAO={airportICAO}/>
                            <p></p>
                        {/* <div>
                            <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button className={buttonDark}>View All Airport Details</button></Link><br></br>
                            {isAdminRole && <div>
                            <Link to={`/details/${airportICAO}/overview`} state={{airportICAO}}> <button className={buttonDark}>Edit Airport Info</button></Link><br></br>
                            <Link to={`/details/${airportICAO}/runways`} state={{airportICAO}}> <button className={buttonDark}>Edit Runway Info</button></Link><br></br>
                            <Link to={`/details/${airportICAO}/departures`} state={{airportICAO}}> <button className={buttonDark}>Add / Edit Departures</button></Link><br></br>
                             </div>}
                        </div> */}
                           
                    </div>}
                </div> 
            </div>
        </div>
    )

}
