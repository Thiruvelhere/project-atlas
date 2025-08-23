import { useState } from "react";
import { useVotingContract } from "./hooks/useVotingContract";

function App() {
  const { contract, account } = useVotingContract();
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null);

  const fetchCandidates = async () => {
    if (!contract) return;
    const list = await contract.getCandidates();
    setCandidates(list);
  };

  const vote = async (index) => {
    if (!contract) return;
    const tx = await contract.vote(index);
    await tx.wait();
    fetchCandidates();
  };

  const getWinner = async () => {
    if (!contract) return;
    const w = await contract.getWinner();
    setWinner(w);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Voting DApp</h1>
      <p>Connected as: {account}</p>
      <button onClick={fetchCandidates}>Load Candidates</button>
      <ul>
        {candidates.map((c, i) => (
          <li key={i}>
            {c} <button onClick={() => vote(i)}>Vote</button>
          </li>
        ))}
      </ul>
      <button onClick={getWinner}>Get Winner</button>
      {winner && <h2>Winner: {winner}</h2>}
    </div>
  );
}

export default App;
