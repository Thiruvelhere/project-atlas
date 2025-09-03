import React, { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import VotingFactoryAbi from "../abis/VotingFactory.json";

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";

export default function App() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [provider, setProvider] = useState(null);
  const [factory, setFactory] = useState(null);
  const [electionCount, setElectionCount] = useState(0);
  const [electionMeta, setElectionMeta] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [adminAddress, setAdminAddress] = useState(null);

  // Static provider (read-only)
  useEffect(() => {
    const p = new ethers.JsonRpcProvider(RPC_URL);
    setProvider(p);
    const c = new ethers.Contract(FACTORY_ADDRESS, VotingFactoryAbi, p);
    setFactory(c);

    // fetch admin if possible
    (async () => {
      try {
        const admin = await c.admin();
        setAdminAddress(admin.toLowerCase());
      } catch (e) {
        console.log("No admin in contract yet");
      }
    })();
  }, []);

  // When signer (wallet) is connected, attach signer to contract
  useEffect(() => {
    if (!walletClient) return;

    const ethersProvider = new ethers.BrowserProvider(walletClient);
    (async () => {
      const signer = await ethersProvider.getSigner();
      const c = new ethers.Contract(FACTORY_ADDRESS, VotingFactoryAbi, signer);
      setFactory(c);
    })();
  }, [walletClient]);

  async function loadElections() {
    if (!factory) return;
    const count = await factory.electionCount();
    setElectionCount(Number(count.toString()));
    if (Number(count) > 0) {
      const meta = await factory.getElectionMeta(0);
      setElectionMeta({
        title: meta[0],
        start: Number(meta[1].toString()),
        end: Number(meta[2].toString()),
        active: meta[3],
        ended: meta[4],
        revealDuringVoting: meta[5],
      });
      const cands = await factory.getCandidates(0);
      setCandidates(cands);
    }
  }

  async function castVote(idx) {
    if (!factory || !isConnected) {
      alert("Connect wallet first");
      return;
    }
    try {
      const tx = await factory.vote(0, idx);
      await tx.wait();
      alert("Vote cast!");
      await loadElections();
    } catch (e) {
      alert("Error: " + (e?.error?.message || e.message));
    }
  }

  async function createElection(title, candidatesArr, revealDuringVoting = false) {
    if (!factory) return;
    const tx = await factory.createElection(title, candidatesArr, revealDuringVoting);
    await tx.wait();
    await loadElections();
  }

  async function startElection(id, start, end) {
    if (!factory) return;
    const tx = await factory.startElection(id, start, end);
    await tx.wait();
    await loadElections();
  }

  async function endElection(id) {
    if (!factory) return;
    const tx = await factory.endElection(id);
    await tx.wait();
    await loadElections();
  }

  // load once
  useEffect(() => {
    loadElections();
  }, [factory]);

  const isAdmin = address && adminAddress && address.toLowerCase() === adminAddress;

  return (
    <div className="container" style={{ padding: 20, fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>🗳️ Project Atlas — Voting</h1>
        <ConnectButton />
      </div>

      <div className="card" style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div className="title" style={{ fontWeight: 600, fontSize: "1.2em" }}>
              {electionMeta?.title || "No election created yet"}
            </div>
            <div className="small">
              Status:{" "}
              {electionMeta
                ? electionMeta.active
                  ? "Ongoing"
                  : electionMeta.ended
                  ? "Ended"
                  : "Upcoming"
                : "—"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="small">Connected: {address || "—"}</div>
            <div className="small">Admin: {adminAddress || "—"}</div>
          </div>
        </div>

        <hr style={{ margin: "12px 0" }} />

        <div>
          <div style={{ fontWeight: 600 }}>Candidates</div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {candidates.map((c, i) => (
              <li key={i} style={{ display: "flex", justifyContent: "space-between", margin: "6px 0" }}>
                <span>{c}</span>
                <button
                  style={{
                    padding: "4px 8px",
                    border: "1px solid #007bff",
                    background: "#007bff",
                    color: "white",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => castVote(i)}
                >
                  Vote
                </button>
              </li>
            ))}
            {candidates.length === 0 && <li className="small">No candidates</li>}
          </ul>
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            style={{
              padding: "6px 10px",
              border: "1px solid #555",
              background: "#eee",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={loadElections}
          >
            Refresh
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="card" style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Admin Controls</div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid #007bff", background: "#007bff", color: "white" }}
              onClick={async () => {
                const title = "Demo Election";
                await createElection(title, ["Alice", "Bob", "Charlie"], false);
                alert("Created!");
              }}
            >
              Create Demo Election
            </button>

            <button
              style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid green", background: "green", color: "white" }}
              onClick={async () => {
                const now = Math.floor(Date.now() / 1000);
                await startElection(0, now + 5, now + 3605);
                alert("Started");
              }}
            >
              Start Election (in 5s)
            </button>

            <button
              style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid red", background: "red", color: "white" }}
              onClick={async () => {
                await endElection(0);
                alert("Ended");
              }}
            >
              End Election
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
