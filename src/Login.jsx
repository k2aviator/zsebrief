import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './db'
import './Zsebrief.css'
import logo from './icons/zsebrief.png'

//console.log("db auth ", db)


export default function Login() {


    // Configure FirebaseUI.
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/home',
        // We will display Google.
        signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //need a web domain for application
        ],
    };

    return (
        <div className="body">
            <div className="header-logo">
                <img src={logo}></img>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} /> 
            </div>    
        </div>
    );
}
