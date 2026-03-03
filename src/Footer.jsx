import React from 'react';
import './Zsebrief.css';
import { Link } from "react-router-dom";

export default function Template() {  
    return (

        <div className="footer-center">
            <div className="footer-center-left">COPYRIGHT 2026 | V030226</div>
            <div className="footer-center-middle">  <Link to="/privacy">PRIVACY POLICY</Link></div>
            <div className="footer-center-right">INQUIRIES @ ZSEBRIEF . COM</div>
        </div>
        
   )

}

