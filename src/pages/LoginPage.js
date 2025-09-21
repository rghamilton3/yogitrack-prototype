import React from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="background">
      <div className="overlay">
        <div className="layout--center">
          <div className="card">
            <img src="images/Logo.png" alt="YogiTrack Logo" className="logo--large" />
            <h1>YogiTrack</h1>
            <p>Yoga Studio Management System</p>
            <Link to="/dashboard" className="btn btn--primary">Enter Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;