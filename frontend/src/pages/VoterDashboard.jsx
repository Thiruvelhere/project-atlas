import React from "react";
import "./VoterDashboard.css";

export default function VoterDashboard() {
  return (
    <div className="voter-dashboard">
      {/* Header / Welcome */}
      <header className="voter-header">
        <h1>Welcome Back, Voter!</h1>
        <p className="subtitle">Your voting hub – quick access to elections and results.</p>
      </header>

      {/* Quick Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <h2>3</h2>
          <p>Active Elections</p>
        </div>
        <div className="stat-card">
          <h2>1</h2>
          <p>Your Votes</p>
        </div>
        <div className="stat-card">
          <h2>5</h2>
          <p>Total Elections</p>
        </div>
      </div>

      {/* Actions */}
      <section className="voter-actions">
        <div className="action-card">
          <div className="icon blue">🗳️</div>
          <h3>Browse Elections</h3>
          <p>View and participate in active elections</p>
          <button className="action-btn">Explore</button>
        </div>
        <div className="action-card">
          <div className="icon green">📊</div>
          <h3>View Results</h3>
          <p>Check real-time election results</p>
          <button className="action-btn">View</button>
        </div>
        <div className="action-card">
          <div className="icon orange">🔍</div>
          <h3>Verify Transparency</h3>
          <p>Ensure votes are securely recorded</p>
          <button className="action-btn">Verify</button>
        </div>
      </section>

      {/* Recent Elections */}
      <section className="recent-elections">
        <h2>Recent Elections</h2>
        <ul>
          <li>🗳️ Student Council 2025</li>
          <li>🗳️ Tech Fest Committee</li>
          <li>🗳️ Annual Sports Club</li>
        </ul>
      </section>
    </div>
  );
}
