import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./icons/zsebrief.png";
import Footer from "./Footer";
import "./Zsebrief.css";

export default function OAuthSuccess({ setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/auth/vatsim/exchange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
          }
        );

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);
        setToken(data.token);

        navigate("/home");

      } catch (err) {
        console.error("OAuth exchange failed:", err);
        navigate("/login");
      }
    };

    exchangeCode();
  }, [navigate, setToken]);

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