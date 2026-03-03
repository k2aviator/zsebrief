import React, { useState } from 'react';
import './Zsebrief.css';

export default function Signin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const mongoSignupURL = `${process.env.REACT_APP_API_URL}/login`;

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);

    const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/;
    setEmailError(!emailRegex.test(value));
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);

    const passwordTest = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
    setPasswordError(!passwordTest.test(value));
  };

  const handleSignin = async (event) => {
    console.log("Email login submit triggered");
    event.preventDefault();

    if (emailError || passwordError) {
      setSubmitMessage("Please fix form errors before submitting.");
      return;
    }

    try {
      const response = await fetch(mongoSignupURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setSubmitMessage("Invalid email or password.");
        return;
      }

      const data = await response.json();

    localStorage.setItem("token", data.token);
    setSubmitMessage("Login successful! Redirecting...");
    window.location.replace("/home");
    


    } catch (error) {
      console.error(error);
      setSubmitMessage("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSignin}>

        <label>Email</label><br />
        <input
          type="email"
          autoComplete="email"
          size="25"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
          className={emailError ? "input-error" : ""}
        /><br /><br />

        <label>Password</label><br />
        <input
          type="password"
          autoComplete="current-password"
          size="25"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          className={passwordError ? "input-error" : ""}
        /><br /><br />

        <button type="submit">Submit</button>
      </form>

      {submitMessage && (
        <p className={submitMessage.includes("successful") ? "success-message" : "error-message"}>
          {submitMessage}
        </p>
      )}
    </div>
  );
}