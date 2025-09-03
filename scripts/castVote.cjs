require("dotenv").config();

const hre = require("hardhat");

async function main() {
  const factoryAddr = process.env.FACTORY;
  const electionId = 0; // or whichever id you created

  const [deployer, user1] = await hre.ethers.getSigners();
  const factory = await hre.ethers.getContractAt("VotingFactory", factoryAddr);

  // check candidates
  const candidates = await factory.getCandidates(electionId);
  console.log("Candidates:", candidates);

  // user1 votes for Bob (index 1)
  const tx = await factory.connect(user1).vote(electionId, 1);
  await tx.wait();
  console.log(`✅ ${user1.address} voted for ${candidates[1]}`);

  // verify tallies (only visible if revealDuringVoting = true OR election ended)
  const tallies = await factory.getTallies(electionId);
  console.log("Tallies:", tallies.map(t => t.toString()));
}

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
