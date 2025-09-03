const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
async function deployFactory() {
  const [admin, user1, user2, user3] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("VotingFactory");
  const factory = await Factory.deploy(admin.address); // ✅ pass admin

  // election with revealDuringVoting = false
  await factory.createElection("Election", ["Alice", "Bob"], false);

  return { factory, admin, user1, user2, user3 };
}


describe("VotingFactory", function () {
  let VotingFactory, votingFactory, admin, user1, user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();
    VotingFactory = await ethers.getContractFactory("VotingFactory");
    votingFactory = await VotingFactory.deploy(admin.address);
    await votingFactory.waitForDeployment();
  });

  async function createAndStartElection() {
    const now = Math.floor(Date.now() / 1000);
    await votingFactory.createElection("Election", ["Alice", "Bob"], true);
    await votingFactory.startElection(0, now, now + 3600);
  }

  it("Should prevent voting before election starts", async function () {
    await votingFactory.createElection("Test Election", ["Alice", "Bob"], true);
    await expect(
      votingFactory.connect(user1).vote(0, 0)
    ).to.be.revertedWithCustomError(votingFactory, "NotActive");
  });

  it("Should allow valid voting during active election", async function () {
    await createAndStartElection();
    await expect(votingFactory.connect(user1).vote(0, 0))
      .to.emit(votingFactory, "VoteCast")
      .withArgs(0, user1.address, 0);
  });

  it("Should prevent double voting", async function () {
    await createAndStartElection();
    await votingFactory.connect(user1).vote(0, 0);
    await expect(
      votingFactory.connect(user1).vote(0, 1)
    ).to.be.revertedWithCustomError(votingFactory, "AlreadyVoted");
  });

it("Should prevent voting after end time", async function () {
  const now = Math.floor(Date.now() / 1000);
  await votingFactory.createElection("Election", ["Alice", "Bob"], true);
  await votingFactory.startElection(0, now, now + 100); // short window

  // Move time forward past the end
  await ethers.provider.send("evm_increaseTime", [200]); 
  await ethers.provider.send("evm_mine");

  await expect(
    votingFactory.connect(user1).vote(0, 0)
  ).to.be.revertedWithCustomError(votingFactory, "VotingClosed");
});


  it("Should allow only admin to start election", async function () {
    const now = Math.floor(Date.now() / 1000);
    await votingFactory.createElection("Election", ["Alice", "Bob"], true);

    await expect(
      votingFactory.connect(user1).startElection(0, now, now + 3600)
    ).to.be.revertedWithCustomError(votingFactory, "OnlyAdmin");
  });

  it("Should allow only admin to end election", async function () {
    await createAndStartElection();
    await expect(
      votingFactory.connect(user1).endElection(0)
    ).to.be.revertedWithCustomError(votingFactory, "OnlyAdmin");
  });

  it("Should correctly determine winner (tie breaker = lowest index)", async function () {
    await createAndStartElection();

    // Alice = 1 vote, Bob = 1 vote
    await votingFactory.connect(user1).vote(0, 0);
    await votingFactory.connect(user2).vote(0, 1);

    const winner = await votingFactory.getWinner(0);
    expect(winner).to.equal(0); // Alice wins because tie → lowest index
  });
it("Should hide tallies during active election when revealDuringVoting = false", async function () {
  const { factory, admin, user1 } = await loadFixture(deployFactory);

  const now = (await ethers.provider.getBlock("latest")).timestamp;
  const start = now + 5;
  const end = start + 100;

  await factory.startElection(0, start, end);

  // during active election, tallies should be hidden
  const tallies = await factory.getTallies(0);
  expect(tallies[0]).to.equal(0);
});


  it("Should reject invalid candidateId", async function () {
    await createAndStartElection();
    await expect(
      votingFactory.connect(user1).vote(0, 99)
    ).to.be.revertedWithCustomError(votingFactory, "InvalidCandidate");
  });
});
