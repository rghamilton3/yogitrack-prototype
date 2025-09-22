import React from 'react';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="layout--sidebar">
      <aside className="sidebar">
        <Link className="logo-wrap" to="/dashboard">
          <img src="images/Logo.png" alt="YogaTrack Logo" className="logo" />
        </Link>
        <nav className="nav">
          <Link to="/instructors">Instructors</Link>
          <Link to="#">Packages</Link>
          <Link to="/classes">Classes</Link>
          <Link to="/customers">Customers</Link>
          <Link to="#">Check-ins</Link>
          <Link to="/">Log Out</Link>
        </nav>
      </aside>

      <main className="layout--center">
        {children}
      </main>
    </div>
  );
}

export default Layout;