// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    string[] public candidates;
    mapping(string => uint256) public votesReceived;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory candidateNames) {
        candidates = candidateNames;
    }

    function vote(string memory candidate) public {
        require(!hasVoted[msg.sender], "You have already voted!");
        require(validCandidate(candidate), "Invalid candidate!");

        votesReceived[candidate] += 1;
        hasVoted[msg.sender] = true;
    }

    function validCandidate(string memory candidate) public view returns (bool) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (
                keccak256(abi.encodePacked(candidates[i])) ==
                keccak256(abi.encodePacked(candidate))
            ) {
                return true;
            }
        }
        return false;
    }

    function totalVotesFor(string memory candidate) public view returns (uint256) {
        require(validCandidate(candidate), "Invalid candidate!");
        return votesReceived[candidate];
    }

    function getAllCandidates() public view returns (string[] memory) {
        return candidates;
    }

    function getWinner() public view returns (string memory winner) {
        require(candidates.length > 0, "No candidates available");
        uint256 highestVotes = 0;
        string memory leadingCandidate = candidates[0];

        for (uint256 i = 0; i < candidates.length; i++) {
            if (votesReceived[candidates[i]] > highestVotes) {
                highestVotes = votesReceived[candidates[i]];
                leadingCandidate = candidates[i];
            }
        }

        return leadingCandidate;
    }
}
