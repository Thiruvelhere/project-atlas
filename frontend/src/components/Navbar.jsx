import React from "react";
import "../styles/components.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Voting DApp</h1>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/vote">Vote</a>
        <a href="/results">Results</a>
      </div>
    </nav>
  );
}
