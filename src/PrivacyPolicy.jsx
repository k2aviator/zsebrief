import React, { useEffect, useState } from "react";
import "./Zsebrief.css";
import logo from "./icons/zsebrief.png";
import Footer from "./Footer";

export default function PrivacyPolicy() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      const newIsMobile = window.innerWidth <= 600;
      setIsMobile(newIsMobile);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => {
      window.removeEventListener("resize", checkWindowWidth);
    };
  }, []);

  return (
    <div className="parent">

      <div className="header-nav-light">
        <noscript>
          <iframe
            title="Google Analytics"
            src="https://www.googletagmanager.com/ns.html?id=GTM-M8V5JMD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      </div>

      <div className="main-body" style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div className="header-logo">
          <img src={logo} alt="zse brief logo" className="image" />
        </div>

        <div>
          <h1>Privacy Policy</h1>
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

          <h2>1. Introduction</h2>
          <p>
            ZSEBrief ("we", "our", or "us") respects your privacy. This Privacy
            Policy explains what information we collect, how we use it, and how
            we protect it when you use our application.
          </p>

          <h2>2. Information We Collect</h2>
          <ul>
            <li>Email address (for account creation and login)</li>
            <li>VATSIM CID and profile information (when using VATSIM SSO)</li>
            <li>User roles (for access control)</li>
            <li>Basic analytics and usage data</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Authenticate users</li>
            <li>Provide operational airport data</li>
            <li>Determine user permissions</li>
            <li>Improve application performance</li>
          </ul>

          <h2>4. Authentication & Security</h2>
          <p>
            We use JSON Web Tokens (JWT) for authentication. Passwords are
            securely hashed and never stored in plain text. VATSIM Single
            Sign-On (SSO) authentication is handled through VATSIM’s official
            OAuth system.
          </p>

          <h2>5. Google Analytics</h2>
          <p>
            We use Google Analytics and Google Tag Manager to collect
            aggregated usage data such as pages visited, session duration,
            browser type, and approximate geographic region. This information
            helps improve the performance and usability of the application.
          </p>
          <p>
            Google may process this data according to its own Privacy Policy.
            You can opt out of Google Analytics tracking using browser
            extensions provided by Google.
          </p>

          <h2>6. Cookies & Local Storage</h2>
          <p>
            ZSEBrief uses browser local storage to store authentication tokens
            for session management. Analytics tools may use cookies to measure
            usage patterns.
          </p>

          <h2>7. Data Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal information. Data is
            used solely for authentication, authorization, and application
            functionality.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be
            reflected on this page with an updated revision date.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please
            contact the application administrator.
          </p>
        </div>
      </div>

      <div className="footer-light">
        <Footer />
      </div>

    </div>
  );
}