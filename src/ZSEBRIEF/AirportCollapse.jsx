import React, { useState, useEffect } from 'react';

//Expand and collapse airports
export default function GetAirportDetails(airportICAO) {  
    console.log("clicked on airport details link", airportICAO)
  

    const [isOpen, toggleIsOpen] = useState(false)



    return (
        <div className="content">
            <p>{airportICAO}</p>

        </div>
    )


}
