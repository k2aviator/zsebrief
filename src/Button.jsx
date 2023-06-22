import React from 'react'
import { useContext } from 'react';
import useTheme from './useTheme'

export default function Button(){
    const {themeName, toggleTheme} = useTheme()
    return (
        <button onClick={toggleTheme}>Button for our theme is: {themeName}</button>
    )

}