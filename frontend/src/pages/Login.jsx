import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleCardClick = (role) => {
    setSelectedRole(role);
  };

  const handleConnect = () => {
    if (!selectedRole) return; // No role selected
    setIsConnecting(true);

    setTimeout(() => {
      if (selectedRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/voter");
      }
    }, 1500); // Simulate connecting delay
  };

  return (
    <div className="login-wrapper">
      <h1 className="login-heading">Choose Your Access Level</h1>
      <p className="login-subtext">
        Select how you'd like to participate in the BlockVote platform. Each
        role provides different capabilities and access levels.
      </p>

      <div className="card-container">
        {/* Admin Access Card */}
        <div
          className={`access-card ${selectedRole === "admin" ? "selected" : ""}`}
          onClick={() => handleCardClick("admin")}
        >
          <div className="icon admin-icon">🛡️</div>
          <h2 className="card-title">Admin Access</h2>
          <p className="card-desc">Full platform management capabilities</p>
          <ul className="feature-list">
            <li>✅ Create and manage elections</li>
            <li>✅ Start and stop voting periods</li>
            <li>✅ View detailed analytics and results</li>
            <li>✅ Monitor voter activity</li>
          </ul>
          <span className="badge admin-badge">Requires Admin Wallet</span>
        </div>

        {/* Voter Access Card */}
        <div
          className={`access-card ${selectedRole === "voter" ? "selected" : ""}`}
          onClick={() => handleCardClick("voter")}
        >
          <div className="icon voter-icon">🗳️</div>
          <h2 className="card-title">Voter Access</h2>
          <p className="card-desc">Participate in elections and view results</p>
          <ul className="feature-list">
            <li>✅ Browse available elections</li>
            <li>✅ Cast secure blockchain votes</li>
            <li>✅ View election results</li>
            <li>✅ Verify vote transparency</li>
          </ul>
          <span className="badge voter-badge">Any Wallet Address</span>
        </div>
      </div>

      {/* Connect Button */}
      <div className="connect-wrapper">
        <button
          className={`connect-btn ${!selectedRole ? "disabled" : ""}`}
          onClick={handleConnect}
          disabled={!selectedRole || isConnecting}
        >
          {isConnecting
            ? `Connecting to ${selectedRole === "admin" ? "Admin" : "Voter"}...`
            : "Connect"}
        </button>
      </div>
    </div>
  );
}
