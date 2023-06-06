import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import GetAllAirportRunwaysEdit from './GetAirportRunwaysEdit'
import AirportDisplayOverview from './AirportDisplayOverview'
import GetAirportDeparturesEdit from './GetAirportDeparturesEditList'
import Header from './Header';
import Footer from './Footer'
import { Link } from 'react-router-dom';

export default function AirportEdit(){

    // eslint-disable-line
    const [hasError, setHasError] = useState(false);
    
    const location = useLocation()
    const airportICAO = location.state.airportICAO

    const [isAdminRole, setIsAdminRole] = useState('false')

    var token = localStorage.getItem('token');
    //console.log("run is admin function... token is ", token)
    const mongoIsAdminURL = "https://zsebrief-backend-production.up.railway.app/login/isadmin" //PRODUCTION
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
                console.log(error)
                setHasError(true);
            })
        }
        fetchData()

    }, [token]);
    
    return (
        <div>
            <div className="header-nav">
            </div>
       
            <div className='main-body'>
                <div className="sticky-header">
                <Header />
                </div>
                    <div className="details-margin-top">
                        <h3>Details for {airportICAO}</h3>
                    </div>
                    <div>
                        <h4>Airport details:</h4> 
                    </div>
                        <AirportDisplayOverview airportICAO={airportICAO}/>
                        {isAdminRole && <div>
                            <Link to={`/details/${airportICAO}/overview`} state={{airportICAO}}> <button>Edit General Airport Information</button></Link><br></br>
                            &nbsp;<br></br>
                        </div>}
    
                    <div>
                        <h4>Airport runway details:</h4> 
                      
                    </div>
                    <GetAllAirportRunwaysEdit airportICAO={airportICAO}/>

                    {isAdminRole && <div>
                            <Link to={`/details/${airportICAO}/runways`} state={{airportICAO}}> <button>Edit Runway Information</button></Link><br></br>
                            &nbsp;<br></br>
                        </div>}
                    <div>
                        <h4>All departure information:</h4> 
                        {isAdminRole && <div>
                        <Link to={`/details/${airportICAO}/departures/add-new`} state={{airportICAO}}> <button>Add new departure</button></Link><br></br>
                        <p></p>
                        </div>}           
                    </div>
                    <GetAirportDeparturesEdit airportICAO={airportICAO}/>
                    &nbsp;<br></br>
                    &nbsp;<br></br>
                </div>
                
            <div className="footer">
                <Footer/> 
            </div>
        </div>
    )
}
