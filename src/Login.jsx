import React from 'react';
import './Zsebrief.css'
import logo from './icons/zsebrief.png'
import Signin from './Signin'
import Footer from './Footer'


export default function Login() {


    return (
        <div>
            <div className="yellow-ribbon">
            <p>UPDATE: Please create a new account with the 'Create account button' as the backend changed on 5/31/23.</p>
            </div>
            <div className="header-nav-light">
            <noscript><iframe title="Google Analytics" src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
            </div>       
      
            <div className='main-body'>
                  <div className="header-logo">
                    <img src={logo} alt="zse brief logo"></img>

                    <p>Welcome to ZSEBrief, a simple app designed to give Seattle Virtual ARTCC (ZSE) controllers visibility into the operations of over 30 airports while working Enroute or TRACON positions on the VATSIM network.</p>
                    <p>In the Pacific Northwest the weather is dynamic and staying on top of which runways and procedures to use can be a burden, especially when you have a bustling sector. With a few clicks, ZSEBrief makes it possible to work your airports like a pro.</p>
                    <p>Have a good shift and please sign-in to get started!</p> 
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
