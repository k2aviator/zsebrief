import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { convertTime12to24 } from './utilTime'
import './Zsebrief.css';
import logo from './icons/zsebrief.png'


export default function Header() {
    const [time, setTime] = useState(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22));
    const [pstTime, setPstTime] = useState()
    const [showDropdown, setShowDropdown] = useState(false);
    const [isAdminRole, setIsAdminRole] = useState('false')

    var token = localStorage.getItem('token');

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
                console.error('An error occurred:', error);
            })
        }
        fetchData()

    }, [token]);

    //Set zulu time
    useEffect(() => {
        const interval = setInterval(() => 
        setTime(new Date().toUTCString().substring(17,19) + new Date().toUTCString().substring(20,22)), 1000);
        return () => {
          clearInterval(interval);
        };
      }, []);

     //Set PST Time
    useEffect(() => {
    const pstInterval = setInterval(() => 
        setPstTime(convertTime12to24(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}).substring(10,21).trim()))
    , 1000);
    return () => {
        clearInterval(pstInterval);
    };
    }, []);

    //Logout

    const signOut = ()=> {
        localStorage.removeItem('token');
        setTimeout(() => {
            // Redirect the user to the desired page
            window.location.href = '/';
          }, 1000);
    }


    const toggleDropdown = () => {
        setShowDropdown(prevState => !prevState);
      };

    //Display home content
    
    return (
        <header>
            <noscript><iframe title="Google Analytics" src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
            <div>
                <div className="header-box-top">
              
    
                    <div className="header-logo">   
                        <Link to="/home"><img alt="zse brief logo" src={logo}></img></Link>  
                    </div>
        
                    <div className="header-right-top">
                            <div className="header-welcome">
                            Time is {time}Z | {pstTime} PST
                            </div>
                            <div className="header-signout">
                            <button onClick={signOut}>Sign out</button>
                            </div>
                    </div>
                </div>
                <div className="header-box-bottom">
                        <nav>
                            <ul>
                            <li>
                                <Link to="/home">Home</Link>
                            </li>
                            {isAdminRole && (
                                <li
                                className="dropdown"
                                onMouseEnter={toggleDropdown}
                                onMouseLeave={toggleDropdown}
                                >
                                {/* <Link to="/admin">Admin</Link> */}
                                Admin
                                {showDropdown && (
                                    <div className="dropdown-content">
                                    <ul>
                                        <li>
                                        <Link to="/admin/deps-by-class/b">Class B Deps</Link>
                                        </li>
                                        <li>
                                        <Link to="/admin/deps-by-class/c">Class C Deps</Link>
                                        </li>
                                        <li>
                                        <Link to="/admin/deps-by-class/d">Class D Deps</Link>
                                        </li>
                                      
                                    </ul>
                                    </div>
                                )}
                                </li>
                            )}
                            </ul>
                        </nav>
                    </div>
                </div>               
        </header>
    )
}
