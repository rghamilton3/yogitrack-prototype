import React from 'react';

function Dashboard() {
  return (
    <div className="card">
      <h1>Dashboard</h1>
      <p>Welcome to YogiTrack - your yoga studio management system.</p>
      <div className="btn-row">
        <a href="/instructors" className="btn btn--primary">Manage Instructors</a>
        <a href="/customers" className="btn btn--primary">Manage Customers</a>
        <a href="#" className="btn">Manage Packages</a>
        <a href="#" className="btn">Class Schedule</a>
      </div>
    </div>
  );
}

export default Dashboard;