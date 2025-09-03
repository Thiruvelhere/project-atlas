require("dotenv").config();

const hre = require("hardhat");

async function main() {
  // Either from .env or hardcode
  const factoryAddr = process.env.FACTORY || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Ensure it's a string
  if (!factoryAddr || !factoryAddr.startsWith("0x")) {
    throw new Error("❌ Invalid factory address. Set FACTORY env variable or hardcode.");
  }

  const factory = await hre.ethers.getContractAt("VotingFactory", factoryAddr);

  // Create election
  const tx1 = await factory.createElection(
    "Student Council 2025",
    ["Alice", "Bob", "Charlie"],
    false
  );
  await tx1.wait();

  // Get new election id
  const id = (await factory.electionCount()) - 1n;
  console.log("✅ Election created with id:", id.toString());

  // Start election
  const now = Math.floor(Date.now() / 1000);
  const start = now + 30;   // starts in 30s
  const end = now + 3600;   // ends in 1h
  await factory.startElection(id, start, end);

  console.log(`✅ Election started: ${start} -> ${end}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
