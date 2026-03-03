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
            ZSEBrief ("we", "our", or "us") respects your privacy and is committed to
            protecting your personal data. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use this
            application.
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
            <li>Email address (for account creation and authentication)</li>
            <li>VATSIM CID and related profile information (when using VATSIM SSO)</li>
            <li>User roles (for access control and authorization)</li>
            <li>Technical usage and analytics data</li>
        </ul>

        <h2>3. Lawful Basis for Processing (GDPR)</h2>
        <p>
            Where Regulation (EU) 2016/679 (General Data Protection Regulation – GDPR)
            applies, we process personal data on one or more of the following lawful bases:
        </p>
        <ul>
            <li>Performance of a contract (providing account access and functionality)</li>
            <li>Legitimate interests (security, performance monitoring, system administration)</li>
            <li>Consent (where applicable, such as analytics tracking)</li>
        </ul>

        <h2>4. How We Use Your Information</h2>
        <ul>
            <li>Authenticate users and manage sessions</li>
            <li>Provide airport and operational data services</li>
            <li>Determine and enforce user permissions</li>
            <li>Maintain system security</li>
            <li>Improve performance and usability</li>
        </ul>

        <h2>5. Authentication & Security</h2>
        <p>
            We use JSON Web Tokens (JWT) for authentication. Passwords (if used) are
            securely hashed and never stored in plain text. When using VATSIM Single
            Sign-On (SSO), authentication is handled through VATSIM's official OAuth
            system.
        </p>

        <h2>6. Google Analytics</h2>
        <p>
            We use Google Analytics and Google Tag Manager to collect aggregated usage
            information such as pages visited, session duration, browser type, and
            approximate geographic region. This data helps improve system performance
            and user experience.
        </p>
        <p>
            Google processes this information according to its own Privacy Policy.
            Users may opt out of Google Analytics tracking using tools provided by
            Google.
        </p>

        <h2>7. Cookies & Local Storage</h2>
        <p>
            ZSEBrief uses browser local storage to store authentication tokens for
            session management. Analytics tools may use cookies to measure usage
            patterns.
        </p>

        <h2>8. Data Sharing</h2>
        <p>
            We do not sell, rent, or trade personal information. Personal data is used
            solely for authentication, authorization, and operational functionality.
        </p>

        <h2>9. Data Retention</h2>
        <p>
            Personal data is retained only for as long as necessary to provide account
            access and system functionality. Users may request deletion of their
            account and associated data at any time.
        </p>

        <h2>10. Your Rights Under Regulation (EU) 2016/679 (GDPR)</h2>
        <p>
            If you are located in the European Economic Area (EEA) or where GDPR
            applies, you have the following rights:
        </p>
        <ul>
            <li><strong>Right of Access</strong> – Request access to your personal data.</li>
            <li><strong>Right to Rectification</strong> – Request correction of inaccurate data.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten")</strong> – Request deletion of your personal data.</li>
            <li><strong>Right to Restriction of Processing</strong> – Request limitation of data processing.</li>
            <li><strong>Right to Data Portability</strong> – Request transfer of your data.</li>
            <li><strong>Right to Object</strong> – Object to certain types of processing.</li>
            <li><strong>Right to Withdraw Consent</strong> – Withdraw consent where processing is based on consent.</li>
        </ul>

        <p>
            Requests will be reviewed and responded to in accordance with applicable
            data protection laws.
        </p>

        <h2>11. GDPR Contact Point</h2>
        <p>
            For any requests related to Regulation (EU) 2016/679 (GDPR), including
            access, rectification, erasure, or other data subject rights, please
            contact:
        </p>
        <p>
            <strong>Email:</strong> inquiries@zsebrief.com
        </p>
        <p>
            This email address serves as the designated point of contact for all GDPR
            related inquiries.
        </p>

        <h2>12. Changes to This Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. Updates will be posted
            on this page with a revised "Last Updated" date.
        </p>
        </div> 
      </div>

      <div className="footer-light">
        <Footer />
      </div>

    </div>
  );
}