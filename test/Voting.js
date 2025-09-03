import { expect } from "chai";
import pkg from "hardhat";

const { ethers } = pkg;

describe("Voting", function () {
  let Voting, voting, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(["Alice", "Bob", "Charlie"]);
    await voting.waitForDeployment();
  });

  it("Should deploy with correct candidates", async function () {
    expect(await voting.candidates(0)).to.equal("Alice");
    expect(await voting.candidates(1)).to.equal("Bob");
    expect(await voting.candidates(2)).to.equal("Charlie");
  });

  it("Should allow a user to vote", async function () {
    await voting.connect(addr1).vote("Bob");
    const voteCount = await voting.totalVotesFor("Bob");
    expect(voteCount).to.equal(1n);
  });

  it("Should not allow double voting", async function () {
    await voting.connect(addr1).vote("Alice");
    await expect(voting.connect(addr1).vote("Bob")).to.be.revertedWith(
      "You have already voted!"
    );
  });
it("Should reject votes for invalid candidates", async function () {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(["Alice", "Bob", "Charlie"]);
  await voting.waitForDeployment();

  await expect(voting.vote("NotACandidate")).to.be.revertedWith("Invalid candidate!");
});

  it("Should tally votes correctly", async function () {
    await voting.connect(addr1).vote("Alice");
    await voting.connect(addr2).vote("Alice");
    const votesAlice = await voting.totalVotesFor("Alice");
    expect(votesAlice).to.equal(2n);
  });
});
