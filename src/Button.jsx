import React from 'react'
import { useContext } from 'react';
import useTheme from './useTheme'
import darkModeIcon from './icons/darkmode.svg'
import test from './icons/windcalm.svg'

export default function Button(){
    const {themeName, toggleTheme} = useTheme()
    const iconDark = themeName === "dark" ? 'icon-dark' : 'icon-light';

    return (
        // <button onClick={toggleTheme} className={buttonDark}>Night mode: {darkIcon} </button>
        <span><img onClick={toggleTheme}  className={iconDark} src={darkModeIcon}></img></span>
        
    )

}