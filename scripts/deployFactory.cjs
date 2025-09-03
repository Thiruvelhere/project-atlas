require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [admin] = await hre.ethers.getSigners();

  console.log("Deploying VotingFactory with admin:", admin.address);

  const Factory = await hre.ethers.getContractFactory("VotingFactory");
  const factory = await Factory.deploy(admin.address); // ✅ pass admin

  await factory.waitForDeployment();

  console.log("✅ Factory deployed at:", await factory.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
