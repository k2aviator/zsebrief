import React, { useState, useEffect } from 'react';

import './Zsebrief.css'
import logo from './icons/zsebrief.png'
import Signin from './Signin'
import Footer from './Footer'


export default function Login() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkWindowWidth = () => {
        const newIsMobile = window.innerWidth <= 600;
        setIsMobile(newIsMobile);
        console.log('isMobile:', newIsMobile);
      };
  
   
      // Call the checkWindowWidth function on initial load
      checkWindowWidth();
  
      // Attach an event listener to window resize
      window.addEventListener('resize', checkWindowWidth);
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', checkWindowWidth);
      };
    }, []);

    const vatsimSSO = 'https://auth-dev.vatsim.net/oauth/authorize?client_id=76&client_secret=qdXcEyuhycldIs4w86xsck6OklfDCvWgLRHuzyFf&redirect_uri=http://localhost:3000/login&response_type=code&scope=full_name+email+vatsim_details&state=d0d657bf5db2748024229aa600fd6613aceb3fcb4be36a557229fdcafc2868ad'

    const fetchData = async () => {
          
      fetch(vatsimSSO, {
      method:'POST', 
      headers:  {
         'Content-Type': 'application/json',
          },
      }).then(response=> response.json()
      ).then(data=>{
          console.log("returned data is ", data)
      }).catch (error => {
      })
  }
  
  /*10000010*/
    return (
        <div className={`parent`}>
            <div className="yellow-ribbon">
            <p>UPDATE: Please create a new account with the 'Create account button' as the backend changed on 5/31/23.</p>
            </div>
            <div className="header-nav-light">
            <noscript><iframe title="Google Analytics" src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
            </div>       
      
            <div className='main-body'>
                  <div className="header-logo">
                    <img src={logo} alt="zse brief logo" className={`image`}></img>
                </div>
                <div>
                    <p>Welcome to ZSEBrief, a simple app designed to give Seattle Virtual ARTCC (ZSE) controllers visibility into the operations of over 30 airports while working Enroute or TRACON positions on the VATSIM network.</p>
                    <p>In the Pacific Northwest the weather is dynamic and staying on top of which runways and procedures to use can be a burden, especially when you have a bustling sector. With a few clicks, ZSEBrief makes it possible to work your airports like a pro.</p>
                    <p>Have a good shift and please sign-in to get started!</p>
                    <p><a href={vatsimSSO}><button> Login with VATSIM</button></a></p>
                    <p>Or, login with user name and password:</p>
                    <Signin/>
                    <p>Don't have an account? <a href="signup"><button> Create account</button></a></p>
                </div>
            </div>
            <div className="footer-light">
                <Footer/> 
            </div>
        </div>
    );
}
