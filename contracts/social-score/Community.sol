// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Project.sol";

contract Community {
    mapping(address => bool) public admins;
    mapping(address => bool) public members;
    mapping(uint => address[]) public communityProjects;
    Project public projectContract;
    
    event CommunityCreated(address indexed creator);
    event ProjectAddedToCommunity(uint indexed projectId);
    event UserJoinedCommunity(address indexed user);
    event UserLeftCommunity(address indexed user);
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only community admin can perform this action");
        _;
    }
    
    constructor(address _projectContract) {
        projectContract = Project(_projectContract);
        admins[msg.sender] = true;
    }
    
    function createCommunity() external {
        emit CommunityCreated(msg.sender);
    }
    
    function addProjectToCommunity(uint projectId) external onlyAdmin {
        communityProjects[projectId].push(msg.sender);
        emit ProjectAddedToCommunity(projectId);
    }
    
    function joinCommunity() external {
        require(!members[msg.sender], "User is already a member of the community");
        
        members[msg.sender] = true;
        
        emit UserJoinedCommunity(msg.sender);
    }
    
    // function leaveCommunity() external {
    //     require(members[msg.sender], "User is not a member of the community");
        
    //     members[msg.sender] = false;
        
    //     emit UserLeftCommunity(msg.sender);
    // }
    
    function addAdmin(address admin) external onlyAdmin {
        admins[admin] = true;
    }
    
    function removeAdmin(address admin) external onlyAdmin {
        admins[admin] = false;
    }
}
