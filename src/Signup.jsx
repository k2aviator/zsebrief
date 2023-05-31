import React, { useState, useEffect } from 'react';
import 'firebase/compat/auth';
import './db'
import './Zsebrief.css'
import logo from './icons/zsebrief.png'
import Footer from './Footer'

export default function Signup() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [submitMessage, setSubmitMessage] = useState("")
    const [submitReady, setSubmitReady] = useState()
    const [emailError, setEmailError] = useState()
    const [passwordError, setPasswordError] = useState()
    const mongoSignupURL = "https://zsebrief-backend-production.up.railway.app/login/signup"
    
    const user = {"email": email, "password": password}
    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')

    //handle email change
    const handleEmailChange = (event)=> {
        const email = event.target.value;
        setEmail(email)     
        const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/
        if (!emailRegex.test(email)) {
            setEmailError("true");
            emailInput.classList.add("input-error")
          } else {
            emailInput.classList.remove("input-error")
            emailInput.setCustomValidity('')
            setEmailError("false");
          }
    }

    //handle password change
    const handlePasswordChange = (event)=> {
        const password = event.target.value;
        console.log(password)
        setPassword(password)     
        const passwordTest = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/
        if (!passwordTest.test(password)) {
            setPasswordError("true");
            passwordInput.classList.add("input-error")
          } else {
            passwordInput.classList.remove("input-error")
            passwordInput.setCustomValidity('')
            setPasswordError("false"); 
          }
    }
   

    //handle email signup

    const handleSignUp = (event)=>{

        event.preventDefault();
        //console.log('handle sign up function')
        
        if (emailError === "true"){
            console.log('email error', emailError)
            emailInput.setCustomValidity("email form not valid")
            emailInput.reportValidity()
        } 
        
        if (passwordError === "true"){
            console.log('password error', passwordError)
            passwordInput.setCustomValidity("password must contain at least six charachters and contain a special charachter")
            passwordInput.reportValidity()
        } 

        fetch(mongoSignupURL, {
            method:'POST', 
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify(user), // Data to be sent in the request body
        }).then(response=> {
            if (response.ok) {
                setSubmitMessage("Account creation succesful: redirecting you to login page")
                setTimeout(() => {
                    // Redirect the user to the desired page
                    window.location.href = '/';
                  }, 2000);
            } else {
                const errorStatus = response.status
                console.log(errorStatus)
                setSubmitMessage(`Error creating user: error code ${errorStatus}`)
            }
        }).catch (error => {
            console.log(error)
        })
 
    }

    return (
        <div>
            <div className="header-nav">
            <noscript><iframe title="Google Analytics" src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
            </div>       
            <div className='main-body'>
                  <div className="header-logo">
                    <img src={logo} alt="zse brief logo"></img>
                    <p>Create your account</p>
                    <form onSubmit = {handleSignUp}>
                        <label>Email</label><br></br>
                        <input type="text" id="email" size="25" placeholder="Enter your email address" value={email} onChange={handleEmailChange}/><br></br>
                        &nbsp;<br></br>
                        <label>Password</label><br></br>
                        <input type="text" id="password" size="25" placeholder="Enter your password" value={password} onChange={handlePasswordChange}/><br></br>
                        <button type="submit">Submit</button>
                    </form>
                    &nbsp;<br></br>
                    {submitMessage &&  
                    <p>{submitMessage}</p>
                    }
                 
                </div>
            </div>
            <div className="footer">
                <Footer/> 
            </div>
        </div>
    );
}
