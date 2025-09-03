const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const candidates = ["Alice", "Bob", "Charlie"];

  const voting = await Voting.deploy(candidates);
  await voting.waitForDeployment();

  console.log("✅ Voting deployed at:", voting.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
