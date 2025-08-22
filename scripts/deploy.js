import hre from "hardhat";

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");

  // 👇 Pass the initial candidates here
  const candidateNames = ["Alice", "Bob", "Charlie"];

  const voting = await Voting.deploy(candidateNames);

  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", await voting.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
