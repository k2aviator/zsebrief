import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './db'
import './Zsebrief.css'
import logo from './icons/zsebrief.png'
import Header from './Header';
import Footer from './Footer'

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
        <div>
            <div className="header-nav">
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            </div>       
            <div className='main-body'>
        
                <div className="header-logo">
                    <img src={logo}></img>
                    <p>Please sign-in:</p>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} /> 
                </div>    
            </div>
            <div className="footer">
                <Footer/> 
            </div>
        </div>
    );
}
