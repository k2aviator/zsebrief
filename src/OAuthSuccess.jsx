import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess({ setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setToken(token); 
      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [setToken, navigate]);

  return <p>Signing you in...</p>;
}