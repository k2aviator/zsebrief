import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./icons/zsebrief.png";
import Footer from "./Footer";
import "./Zsebrief.css";

export default function OAuthSuccess({ setToken }) {
  const navigate = useNavigate();

 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return;

  const exchangeCode = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/vatsim/exchange`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.replace("/home");
      } else {
        console.error("OAuth exchange failed:", data);
      }
    } catch (err) {
      console.error("OAuth exchange failed:", err);
    }
  };

  exchangeCode();

}, []);

  return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}
  >
    <div className="spinner"></div>
    <p style={{ marginTop: "20px", fontSize: "18px" }}>
      Signing you in...
    </p>
  </div>
  );
}