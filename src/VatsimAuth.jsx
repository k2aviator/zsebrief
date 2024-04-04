import React, { useState, useEffect } from 'react';
import './Zsebrief.css'
import logo from './icons/zsebrief.png'
import Footer from './Footer'

export default function VatsimAuth() {  
    // const vatsimSSO = 'https://auth-dev.vatsim.net/oauth/authorize?client_id=76&client_secret=qdXcEyuhycldIs4w86xsck6OklfDCvWgLRHuzyFf&redirect_uri=http://localhost:3000/login&response_type=code&scope=full_name+email+vatsim_details&state=d0d657bf5db2748024229aa600fd6613aceb3fcb4be36a557229fdcafc2868ad'

    const vatsimSSO = 'https://auth-dev.vatsim.net/oauth/token'

    // console.log("client id is ", process.env.REACT_APP_VATSIM_SSO_CLIENT_ID)
    // console.log("client secret is ", process.env.REACT_APP_VATSIM_SSO_CLIENT_SECRET)


    const urlParams = new URLSearchParams(window.location.search);

    const code = urlParams.get('code');
    const scope = urlParams.get('scope');
    const state = urlParams.get('state');

    const callBackUrl = `${process.env.REACT_APP_VATSIM_SSO_BASE_URL}/oauth/token`;
    const apiUserUrl = `${process.env.REACT_APP_VATSIM_SSO_BASE_URL}/api/user`;

    console.log("Client id is ", process.env.REACT_APP_VATSIM_SSO_CLIENT_ID)
    console.log("Secret is ", process.env.REACT_APP_VATSIM_SSO_CLIENT_SECRET)
    console.log('Request code:', code);


    const fetchData = async () => {
      
        const requestBody = {
          scopes: ["full_name", "vatsim_details", "email", "country"],
          token_type: "Bearer",
          expires_in: 604800,
          access_token: code
        };
      
        try {
          const response = await fetch(callBackUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
      
          const data = await response.json();
          console.log("Returned data:", data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
    fetchData();    

    return (
        <div className={`parent`}>
            <div className="header-nav-light">
            <noscript><iframe title="Google Analytics" src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
            </div>       
            <div className='main-body'>
                <div className="header-logo">
                <img src={logo} alt="zse brief logo" className={`image`}></img>
                </div>
                <div>
                <p>Authorizing...</p>
                </div>
            </div>
            <div className="footer-light">
                <Footer/> 
            </div>
        </div>
    )

}

