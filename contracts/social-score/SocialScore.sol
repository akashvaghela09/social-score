// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Community.sol";

contract SocialScore {
    struct Account {
        uint score;
        bool exists;
    }
    
    mapping(address => Account) public accounts;
    Community public communityContract;
    
    event AccountCreated(address indexed user, uint score);
    event ScoreUpdated(address indexed user, uint newScore);
    
    modifier onlyMember() {
        require(communityContract.members(msg.sender), "Caller is not a member of the community");
        _;
    }
    
    constructor(address _communityContract) {
        communityContract = Community(_communityContract);
    }
    
    function createAccount() external {
        require(!accounts[msg.sender].exists, "Account already exists");
        
        accounts[msg.sender] = Account(1, true);
        
        emit AccountCreated(msg.sender, accounts[msg.sender].score);
    }
    
    function updateScore(address user, uint newScore) external onlyMember {
        require(accounts[user].exists, "Account does not exist");
        require(newScore >= 0, "Score must be non-negative");
        
        accounts[user].score = newScore;
        
        emit ScoreUpdated(user, newScore);
    }
}
