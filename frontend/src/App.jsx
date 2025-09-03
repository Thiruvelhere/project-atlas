import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./utils/votingSystem.json"; // ABI after compilation

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace after deployment

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState("");

  // Connect wallet + contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

          setAccount(accounts[0]);

          const contractInstance = new ethers.Contract(
            contractAddress,
            contractABI.abi,
            signer
          );
          setContract(contractInstance);
        } catch (err) {
          console.error("Error connecting wallet:", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    init();
  }, []);

  // Load candidates
  const fetchCandidates = async () => {
    try {
      const list = await contract.getAllCandidates();
      setCandidates(list);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  // Vote for a candidate
  const vote = async (candidateName) => {
    try {
      const tx = await contract.vote(candidateName);
      await tx.wait();
      alert(`You voted for ${candidateName}`);
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  // Get winner
  const fetchWinner = async () => {
    try {
      const w = await contract.getWinner();
      setWinner(w);
    } catch (err) {
      console.error("Error fetching winner:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#222", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#0d6efd" }}>Voting DApp</h1>

      {account ? (
        <p>Connected as: {account}</p>
      ) : (
        <p>Please connect your wallet</p>
      )}

      <button onClick={fetchCandidates} style={{ marginTop: "10px" }}>
        Load Candidates
      </button>

      <ul>
        {candidates.length === 0 && <li>No candidates loaded yet</li>}
        {candidates.map((c, i) => (
          <li key={i}>
            {c}{" "}
            <button onClick={() => vote(c)} style={{ marginLeft: "10px" }}>
              Vote
            </button>
          </li>
        ))}
      </ul>

      <button onClick={fetchWinner} style={{ marginTop: "20px" }}>
        Get Winner
      </button>

      {winner && <h2>Winner: {winner}</h2>}
    </div>
  );
}

export default App;
