import React from 'react';
import { Link } from 'react-router-dom';
//<li><Link to="/home">Home</Link></li>       
export default function Nav() {
    return (
        <div>
            <Link to="/home"><h1 className="logo-text">ZSEBRIEF</h1></Link>  
            <Link to="/home">Home</Link>  | <Link to="/nearbyairplanes">Nearby Airplanes</Link>  
        </div>
    );
}