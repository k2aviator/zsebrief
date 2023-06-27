import React, { useState, useEffect, useContext } from 'react';
import GetAirportRunways from './GetAirportRunways'
import GetAirportDepartures from './GetAirportDepartures'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ThemeContext, { ThemeController } from './ThemeContext';
import useTheme from './useTheme';
import Button from './Button'
import Header from './Header';
import Footer from './Footer'
import './Zsebrief.css';
import { convertTime12to24 } from './utilTime'


export default function GetAirportFullPage() {
    const { icao } = useParams();
    const [pstTime, setPstTime] = useState()
    const { themeName, toggleTheme } = useContext(ThemeContext)
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [airport, setAirport] = useState([])
    const buttonDark = themeName === "dark" ? 'button-dark' : '';

    //airport details
   
    const [airportICAO, setAirportICAO] = useState()
    const [airportName, setAirportName] =  useState()
    const [airportTowered, setAirportTowered] = useState()
    const [airportHoursOpen, setAirportHoursOpen]  = useState()
    const [airportHoursClose, setAirportHoursClose]  = useState()
    const [airspaceClass, setAirspaceClass]  = useState()
    const [airportElev, setAirportElev]  = useState()


    const [airportOpen,setAirportOpen] = useState(false)
    const [airportLogo,setAirportLogo] = useState(false)
    const [towerOpen, setTowerOpen] = useState(false)
    const [towerClass, setTowerClass] = useState(false)

    //airport images

    const images = require.context('./logos-airports', false, /\.(png|jpe?g|svg)$/);

    const imageFiles = images.keys().map((path) => {
        const src = images(path);
        const filename = path.replace('./', '');
        return { filename, src };
    });

     //Set PST Time
    useEffect(() => {
    const pstInterval = setInterval(() => 
            setPstTime(convertTime12to24(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}).substring(10,21).trim()))
            , 1000);
    
        return () => {
            clearInterval(pstInterval);
        };
        }, []);


    useEffect(() => {
        if( airportTowered === "TRUE"){
                setAirportOpen(!airportOpen)
        }
    }, [airportTowered])

    
    useEffect(()=>{

        //GET ICAO from URL
        const upperIcao = icao.toUpperCase()

        //const mongoAirportToken =  "?token=auNV6JNACu-VW3cd2FOL5OIhEzv1Q9qJxKiRQok2O7k"
        const mongoAirportURL = `https://zsebrief-backend-production.up.railway.app/airports/${upperIcao}`
        // let mongoUrlFetch = `${mongoAirportURL}${mongoAirportToken}`

        fetch(mongoAirportURL)
        .then(response => response.json())
        .then((data) => {
            setAirport(data);
            setAirportICAO(data.ICAO);
            setAirportName(data.NAME);
            setAirportTowered(data.TOWERED);
            setAirportHoursOpen(data.HRS_OPEN);
            setAirportHoursClose(data.HRS_CLOSE);
            setAirspaceClass(data.AIRSPACE_CLASS);
            setAirportElev(data.ELEV);
            airportImage(data.ICAO)
            },
            (error)=>{
                console.log(error)
                setIsLoading(false);
                setHasError(true);
            }) 
        .then(setIsLoading(false) ) 
       
        }, [icao])
        
    

    //Build page functions

    const airportImage = (airportICAO)=>{
        //console.log("airport image function")
        let codePng = `${airportICAO}.png`
        const indexMatch = imageFiles.findIndex(obj => codePng === obj.filename)   
        //console.log("does the index match?", indexMatch)
        if (indexMatch !== -1){
            // console.log(imageFiles[indexMatch].src)
            setAirportLogo(!airportLogo)
        } 
    }

    const airportImageLoc = (airportICAO)=>{
        let codePng = `${airportICAO}.png`
        const indexMatch = imageFiles.findIndex(obj => codePng === obj.filename)
        return imageFiles[indexMatch].src   
     }

    useEffect(()=>{
        if (airportHoursOpen === 2359){
            // console.log("tower is open")
            setTowerOpen("TWR OPEN")
            setTowerClass("towerOpen")
        }
        else if (parseInt(pstTime) > airportHoursOpen) {
            if (parseInt(pstTime) < airportHoursClose){
                // console.log(airportICAO, "OPEN")
                // console.log("time now is ", pstTime)
                // console.log("airport opens at ", airportHoursOpen, " and closes at", airportHoursClose)
                setTowerOpen("TWR OPEN")
                setTowerClass("towerOpen")
            } else {
                // console.log(airportICAO, "CLOSED")
                // console.log("time now is ", pstTime)
                // console.log("airport opens at ", airportHoursOpen, " and closes at", airportHoursClose)
                setTowerOpen("TWR CLOSED")
                setTowerClass("towerClosed")
            }
        }
     })

    
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



    const roundElevation = (number)=>{
        return Math.ceil(number /100) * 100 + 1000;
    }

    //Display page content

    return (
        <div className={`parent-${themeName}`}>
            <div className={`header-nav-${themeName}`}>
            </div>
            <div className='main-body'>
                <div className={`sticky-header-${themeName}`}>     
                    <Header />
                </div>
                <div className={`collapsible-expand-${themeName}`}>
                    <div className={`headlineText-${themeName}`}>{airportICAO} | {airportName}</div>
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
                                        <td className={towerClass}>{towerOpen}</td>
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
                        
                        {airportLogo &&
                            <div className="airport-logos">
                                    <img alt="airport logo" className={`image-${themeName}`} src={airportImageLoc(airportICAO)}></img>
                        </div>
                        }
                    
                    </div>
                    <GetAirportRunways airportICAO={airportICAO}/>
                    <p></p>
                    <GetAirportDepartures airportICAO={airportICAO}/>
                    <p></p>
                    <Link to={`/details/${airportICAO}`} state={{airportICAO}}> <button className={buttonDark}>View All Airport Details</button></Link><br></br>
                </div>        
            </div>
     
            <div className={`footer-${themeName}`}>
                <Footer/> 
            </div>
        </div>
    );
}
