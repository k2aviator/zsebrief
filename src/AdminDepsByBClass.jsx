import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Header from './Header';
import Footer from './Footer'

export default function AdminDepsByBClass(){
    /* eslint-disable */        
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    /* eslint-enable */
    const [airspaceDepartures, setAirspaceDepartures] = useState([]);



    
    //MONGO DB GET CLASS B DEPARTURES

    //const mongoDepByClassURL = "https://zsebrief-backend-production.up.railway.app/admin/deps-by-class/" //PRODUCTION
    const mongoDepByClassURL = "http://localhost:3000/admin/deps-by-class/" //TEST

    useEffect(()=>{
        fetch(`${mongoDepByClassURL}B`)
        .then(response => response.json())
        .then((data) => {
                setAirspaceDepartures(data);
                setIsLoading(false);   
            },
            (error)=>{
                console.log(error)
                setIsLoading(false);
                setHasError(true);
            })  
        }, [mongoDepByClassURL])


    console.log(airspaceDepartures)

    const airportDeparturesD = airspaceDepartures.map((airport) => {
        const updatedDate = new Date(airport.departures.UPDATED);
        const currentDate = new Date();
        const daysElapsed = isNaN(updatedDate) ? "" : Math.floor((currentDate - updatedDate) / (1000 * 60 * 60 * 24));
        const airportICAO = airport.ICAO
        const departureId = airport.departures._id
        return(
        <tr key={`${airportICAO}-${departureId }`} id={`${departureId}`}>
          <td><Link to={`/details/${airportICAO}/departures/${departureId }`} state={{airportICAO, departureId}}><button>View</button></Link></td>
          <td>{airportICAO}</td>
          <td>{airport.departures.TYPE}</td>
          <td>{airport.departures.NAME} {airport.departures.NUM}</td>
          <td>{airport.departures.UPDATED_BY} </td>
          <td>{isNaN(updatedDate) ? "" : new Date(airport.departures.UPDATED).toLocaleDateString("en-US")}</td>
          <td>{isNaN(daysElapsed) ? "" : daysElapsed}</td>
          {/* Add more table cells for departure properties if needed */}
        </tr>
        )
    });




    return (
            <div>
            <div className="header-nav">
            </div>
    
            <div className='main-body'>
                <div className="sticky-header">
                <Header />
                </div>
                    <div>
                        <h4>Review / Edit departure procedures for Class B airports</h4>
                        <table id="details">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>ICAO</th>
                                    <th>Type</th>
                                    <th>Name/Num</th>
                                    <th>Updated by</th>
                                    <th>Updated date</th>
                                    <th>Days since update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {airportDeparturesD}
                            </tbody>
                        </table>
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
