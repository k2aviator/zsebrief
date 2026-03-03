import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ThemeController } from './ThemeContext';

import Home from './Home';
import Signup from './Signup';
import AdminDepsByDClass from './AdminDepsByDClass';
import AdminDepsByCClass from './AdminDepsByCClass';
import AdminDepsByBClass from './AdminDepsByBClass';
import AirportEdit from './AirportDetails';
import AirportEditOverview from './AirportEditOverview';
import AirportEditRunways from './AirportEditRunways';
import AirportEditDepartures from './AirportEditDepartures';
import GetAirportDeparturesEditOne from './GetAirportDeparturesEditOne';
import GetAirportDeparturesAddOne from './GetAirportDeparturesAddOne';
import GetAirportRunwaysEditOne from './GetAirportRunwaysEditOne';
import GetAirportFullPage from './GetAirportFullPage';
import Login from './Login';
import OAuthSuccess from "./OAuthSuccess";
import PrivacyPolicy from "./PrivacyPolicy";

import './App.css';
import './Zsebrief.css';

function App() {

  const [isAdminRole, setIsAdminRole] = useState(false);

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // 🔐 Protected Route (Requires Login)
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // 🔐 Admin Route (Requires Login + Admin)
  const AdminRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    if (!isAdminRole) {
      return <Navigate to="/home" replace />;
    }
    return children;
  };

  // 🔎 Check Admin Role
  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/login/isadmin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setIsAdminRole(data.admin === true);

      } catch (err) {
        console.error("Admin check failed:", err);
      }
    };

    checkAdmin();
  }, [token]);

  return (
    <ThemeController>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess setToken={setToken} />} />
        {/* Protected Routes */}
        <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home setToken={setToken} />
          </ProtectedRoute>
        }
      />

        <Route
          path="/airports/:icao"
          element={
            <ProtectedRoute>
              <GetAirportFullPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/details/:icao"
          element={
            <ProtectedRoute>
              <AirportEdit />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/details/:icao/overview"
          element={
            <AdminRoute>
              <AirportEditOverview />
            </AdminRoute>
          }
        />

        <Route
          path="/details/:icao/runways"
          element={
            <AdminRoute>
              <AirportEditRunways />
            </AdminRoute>
          }
        />

        <Route
          path="/details/:icao/departures"
          element={
            <AdminRoute>
              <AirportEditDepartures />
            </AdminRoute>
          }
        />

        <Route
          path="/details/:icao/departures/add-new"
          element={
            <AdminRoute>
              <GetAirportDeparturesAddOne />
            </AdminRoute>
          }
        />

        <Route
          path="/details/:icao/departures/:id"
          element={
            <AdminRoute>
              <GetAirportDeparturesEditOne />
            </AdminRoute>
          }
        />

        <Route
          path="/details/:icao/runways/:id"
          element={
            <AdminRoute>
              <GetAirportRunwaysEditOne />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/deps-by-class/d"
          element={
            <AdminRoute>
              <AdminDepsByDClass />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/deps-by-class/c"
          element={
            <AdminRoute>
              <AdminDepsByCClass />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/deps-by-class/b"
          element={
            <AdminRoute>
              <AdminDepsByBClass />
            </AdminRoute>
          }
        />

      </Routes>
    </ThemeController>
  );
}

export default App;