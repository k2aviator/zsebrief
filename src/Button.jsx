import React from 'react'
import { useContext } from 'react';
import useTheme from './useTheme'

export default function Button(){
    const {themeName, toggleTheme} = useTheme()
    const buttonDark = themeName === "dark" ? 'button-dark' : '';
   
    return (
        <button onClick={toggleTheme} className={buttonDark}>Night mode: {themeName}</button>
    )

}