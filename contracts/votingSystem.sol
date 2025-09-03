// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingFactory {
    error OnlyAdmin();
    error InvalidElection();
    error AlreadyVoted();
    error InvalidCandidate();
    error NotActive();
    error VotingClosed();

    event ElectionCreated(uint256 indexed id, string title, string[] candidates, bool revealDuringVoting);
    event ElectionStarted(uint256 indexed id, uint256 start, uint256 end);
    event ElectionPaused(uint256 indexed id);
    event ElectionEnded(uint256 indexed id);
    event VoteCast(uint256 indexed id, address indexed voter, uint256 candidate);

    struct Election {
        string title;
        string[] candidates;              // index = candidateId
        uint256[] votes;                  // parallel array
        uint64 start;                     // unix seconds
        uint64 end;                       // unix seconds
        bool active;
        bool ended;
        bool revealDuringVoting;          // if false, tallies hidden until ended
        mapping(address => bool) voted;   // per-election double-vote guard
    }

    address public admin;
    uint256 public electionCount;
    mapping(uint256 => Election) private elections;

    modifier onlyAdmin() { if (msg.sender != admin) revert OnlyAdmin(); _; }
    modifier valid(uint256 id) { if (id >= electionCount) revert InvalidElection(); _; }

    constructor(address _admin) { admin = _admin == address(0) ? msg.sender : _admin; }

    function createElection(
        string memory title,
        string[] memory candidateNames,
        bool revealDuringVoting
    ) external onlyAdmin returns (uint256 id) {
        require(candidateNames.length >= 2, "Need >= 2 candidates");
        id = electionCount++;
        Election storage e = elections[id];
        e.title = title;
        e.candidates = candidateNames;
        e.votes = new uint256[](candidateNames.length);
        e.revealDuringVoting = revealDuringVoting;
        emit ElectionCreated(id, title, candidateNames, revealDuringVoting);
    }

    function startElection(uint256 id, uint64 start, uint64 end) external onlyAdmin valid(id) {
        require(end > start && end > block.timestamp, "Bad window");
        Election storage e = elections[id];
        e.start = start;
        e.end = end;
        e.active = true;
        emit ElectionStarted(id, start, end);
    }

    function pauseElection(uint256 id) external onlyAdmin valid(id) {
        elections[id].active = false;
        emit ElectionPaused(id);
    }

    function endElection(uint256 id) external onlyAdmin valid(id) {
        Election storage e = elections[id];
        e.active = false;
        e.ended = true;
        emit ElectionEnded(id);
    }

    function vote(uint256 id, uint256 candidateId) external valid(id) {
        Election storage e = elections[id];
        if (!e.active) revert NotActive();
        if (block.timestamp < e.start || block.timestamp > e.end) revert VotingClosed();
        if (candidateId >= e.candidates.length) revert InvalidCandidate();
        if (e.voted[msg.sender]) revert AlreadyVoted();

        e.votes[candidateId] += 1;
        e.voted[msg.sender] = true;
        emit VoteCast(id, msg.sender, candidateId);
    }

    /* -------- Views for UI -------- */

    function getElectionMeta(uint256 id)
        external view valid(id)
        returns (string memory title, uint64 start, uint64 end, bool active, bool ended, bool revealDuringVoting)
    {
        Election storage e = elections[id];
        return (e.title, e.start, e.end, e.active, e.ended, e.revealDuringVoting);
    }

    function getCandidates(uint256 id) external view valid(id) returns (string[] memory) {
        return elections[id].candidates;
    }

    function getTallies(uint256 id) external view valid(id) returns (uint256[] memory) {
        Election storage e = elections[id];
        if (!e.revealDuringVoting && !e.ended) {
            // hide counts while active if configured
            return new uint256[](e.candidates.length);
        }
        return e.votes;
    }

    function hasVoted(uint256 id, address voter) external view valid(id) returns (bool) {
        return elections[id].voted[voter];
    }

    function getWinner(uint256 id) external view valid(id) returns (uint256 winnerId) {
        Election storage e = elections[id];
        uint256 high = 0;
        winnerId = 0;
        for (uint256 i = 0; i < e.votes.length; i++) {
            if (e.votes[i] > high) {
                high = e.votes[i];
                winnerId = i;
            }
        }
        // tie-breaker = lowest index by design; you can change to “return all winners” if you prefer
    }
}
