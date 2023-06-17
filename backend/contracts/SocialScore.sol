// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

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
    }

    uint256 internal nextId;

    mapping(address => User) public users;
    mapping(address => bool) public admins;

    constructor() {
        admins[msg.sender] = true;
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

    function updateSocialScore(address _address, int256 _points) public {
        users[_address].socialScore += _points;
    } 
}
