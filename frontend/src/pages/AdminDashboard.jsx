import React from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="logo">BlockVote</h1>
        <div className="header-right">
          <span className="badge access">Admin Access</span>
          <span className="badge role">Admin</span>
          <span className="address">0x742d...6C87</span>
          <button className="disconnect-btn">Disconnect</button>
        </div>
      </header>

      {/* Title */}
      <div className="dashboard-title">
        <h2>Admin Dashboard</h2>
        <p>Manage elections and monitor voting activity • 2 total elections</p>
      </div>

      {/* Tabs */}
      <nav className="dashboard-tabs">
        <button className="active">Overview</button>
        <button>Create Election</button>
        <button>Manage Elections</button>
        <button>Results & Analytics</button>
      </nav>

      {/* Cards */}
      <section className="card-grid">
        <div className="card">
          <h3>Create Election</h3>
          <p>Set up a new voting election with candidates</p>
        </div>
        <div className="card">
          <h3>Manage Elections</h3>
          <p>Start, stop, or modify existing elections</p>
        </div>
        <div className="card">
          <h3>View Results</h3>
          <p>Monitor real-time voting results and analytics</p>
        </div>
        <div className="card">
          <h3>Voter Activity</h3>
          <p>View participation rates and voter statistics</p>
        </div>
      </section>

      {/* Recent Elections */}
      <section className="recent-elections">
        <h3>Recent Elections</h3>

        <div className="election-card">
          <div className="election-header">
            <h4>Student Council President 2024</h4>
            <span className="status active">Active</span>
          </div>
          <p>Vote for your next student council president</p>
          <p className="meta">3 candidates • 156 votes • Ends: 9/3/2024</p>
          <div className="actions">
            <button className="end-btn">End Election</button>
            <button className="view-btn">View Details</button>
            <button className="view-btn">View Results</button>
          </div>
        </div>

        <div className="election-card">
          <div className="election-header">
            <h4>Community Budget Allocation</h4>
            <span className="status upcoming">Upcoming</span>
          </div>
          <p>Decide how to allocate the community development budget</p>
          <p className="meta">4 candidates • 0 votes • Ends: 5/31/2024</p>
          <div className="actions">
            <button className="start-btn">Start Election</button>
            <button className="view-btn">View Details</button>
          </div>
        </div>
      </section>
    </div>
  );
}
