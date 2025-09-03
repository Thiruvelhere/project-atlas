require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const factoryAddr = process.env.FACTORY;
  const electionId = 0; // whichever election you want to end

  const [admin] = await hre.ethers.getSigners();
  const factory = await hre.ethers.getContractAt("VotingFactory", factoryAddr);

  // End election
  const tx = await factory.connect(admin).endElection(electionId);
  await tx.wait();
  console.log(`✅ Election ${electionId} ended by admin`);

  // Now fetch tallies
  const candidates = await factory.getCandidates(electionId);
  const tallies = await factory.getTallies(electionId);

  console.log("\n📊 Final Results:");
  candidates.forEach((c, i) => {
    console.log(`${c}: ${tallies[i].toString()} votes`);
  });

  const winnerIndex = await factory.getWinner(electionId);
  console.log(`\n🏆 Winner: ${candidates[winnerIndex]}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
