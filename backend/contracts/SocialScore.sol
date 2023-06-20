// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./SSToken.sol";

contract SocialScore {
    struct Community {
        uint256 id;
        string name;
    }

    struct Event {
        uint256 id;
        uint256 name;
    }

    struct User {
        uint256 userId;
        address walletAddress;
        int256 socialScore;
        bool isBanned;
        uint256 balance;
    }

    uint256 internal nextId;

    mapping(address => User) public users;
    mapping(address => bool) public admins;

    SSToken private ssToken;

    uint256 public burnQuantity = 5;

    constructor(address _tokenAddress) {
        admins[msg.sender] = true;
        ssToken = SSToken(_tokenAddress);
    }

    function addAdmin(address _address) public {
        admins[_address] = true;
    }

    function removeAdmin(address _address) public {
        admins[_address] = false;
    }

    function register() public {
        User storage newUser = users[msg.sender];
        newUser.userId = nextId;
        newUser.walletAddress = msg.sender;
        newUser.socialScore = 0;
        nextId++;
    }

    function banUser(address _address) public {
        users[_address].isBanned = true;
    }

    function unBanUser(address _address) public {
        users[_address].isBanned = false;
    }

    function getSocialScore(address _address) public view returns (int256) {
        return users[_address].socialScore;
    }

    // load SStoken in SocialScore contract and update users balance
    function loadAccount() public payable {
        ssToken.transferFrom(msg.sender, address(this), msg.value);

        users[msg.sender].balance += msg.value;
    }

    // spend SStoken in SocialScore contract and update users balance
    function spendTokens(address _address) public {
        // ssToken.burn(burnQuantity);

        users[_address].balance -= burnQuantity;
    }

    // check users balance at Social sense
    function balanceAtSocialScore() public view returns (uint256) {
        return users[msg.sender].balance;
    }

    // check users balance of Tokens in Wallet
    function balanceOf() public view returns (uint256) {
        return ssToken.balanceOf(msg.sender);
    }

    function updateSocialScore(address _address, int256 _points) public {
        users[_address].socialScore += _points;

        spendTokens(_address);
    }
}
