/**************************************************************
 * @title Community
 * @version 1.0.0
 * @dev The Community contract allows users to create and manage communities, join events, and interact within the community.
 **************************************************************/

// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./ISocialScore.sol";

/**
 * @title Community
 * @dev The Community contract allows users to create and manage communities, join events, and interact within the community.
 */
contract Community {
    struct MemberAccount {
        address walletAddress;  // User's wallet address
        int256 communityScore;  // User's community score
        bool isBanned;          // Flag indicating if the user is banned
        bool isMember;          // Flag indicating if the user is a member
    }

    struct CommunityAccount {
        uint256 communityId;    // Community's unique identifier
        string name;            // Community's name
        string description;     // Community's description
        string externalURL;     // Community's external URL
    }

    struct CommunityInfo {
        uint256 communityId;    // Community's unique identifier
        string name;            // Community's name
        bool isMember;          // Flag indicating if the user is a member of the community
    }

    struct EventAccount {
        uint256 eventId;        // Event's unique identifier
        uint256 communityId;    // Community's unique identifier
        string name;            // Event's name
        string description;     // Event's description
        string externalURL;     // Event's external URL
    }

    struct EventMemberAccount {
        address walletAddress;  // User's wallet address
        int256 eventScore;      // User's event score
        bool isBanned;          // Flag indicating if the user is banned
        bool isMember;          // Flag indicating if the user is a member
    }

    enum Status {
        APPROVED,               // Application approved by admin
        REJECTED,               // Application rejected by admin
        PENDING                 // Application pending admin approval
    }

    struct EventApplication {
        uint256 eventId;        // Event's unique identifier
        address userAddress;    // User's wallet address
        Status status;          // Application status
    }

    uint256 public nextCommunityId;     // Next community identifier
    uint256 public nextEventId;         // Next event identifier

    // Community identifier => admin status
    mapping(uint256 => mapping(address => bool)) public adminList;              
    
    // Community identifier => user address => community member account
    mapping(uint256 => mapping(address => MemberAccount)) public memberList;    
    
    // Community identifier => community account
    mapping(uint256 => CommunityAccount) public communityList;                  
    
    // User address => community info
    mapping(address => CommunityInfo[]) public userCommunityList;               
    
    // Event identifier => event account
    mapping(uint256 => EventAccount) public eventList;                          
    
    // Event identifier => user address => event member account
    mapping(uint256 => mapping(address => EventMemberAccount)) public eventMemberList;                                                 
    
    EventApplication[] public applicationList; // List of event applications

    ISocialScore private socialScore;   // SocialScore contract interface
    int256 public spendAmount = 5;      // Amount spent for community and event scores

    /**
     * @dev Initializes the Community contract.
     * @param _socialScoreAddress The address of the SocialScore contract.
     */
    constructor(address _socialScoreAddress) {
        socialScore = ISocialScore(_socialScoreAddress);
    }

    /**
     * @dev Modifier to restrict access to admin-only functions within a community.
     * @param _communityId The identifier of the community.
     */
    modifier onlyAdmin(uint256 _communityId) {
        require(
            adminList[_communityId][msg.sender] == true,
            "Don't have access!!"
        );
        _;
    }

    /**
     * @dev Modifier to check if the user has access to a specific community.
     * @param _communityId The identifier of the community.
     */
    modifier checkCommunityAccess(uint256 _communityId) {
        require(
            memberList[_communityId][msg.sender].isMember == true,
            "Not a member!!"
        );
        require(
            memberList[_communityId][msg.sender].isBanned == false,
            "User banned!!"
        );
        _;
    }

    /**
     * @dev Modifier to check if the user has access to a specific event.
     * @param _eventId The identifier of the event.
     */
    modifier checkEventAccess(uint256 _eventId) {
        require(
            eventMemberList[_eventId][msg.sender].isMember == true,
            "Not a member!!"
        );
        require(
            eventMemberList[_eventId][msg.sender].isBanned == false,
            "User banned!!"
        );
        _;
    }

    /**
     * @dev Creates a new community.
     * @param _name The name of the community.
     * @param _description The description of the community.
     * @param _externalURL The external URL of the community.
     */
    function createCommunity(
        string memory _name,
        string memory _description,
        string memory _externalURL
    ) public {
        // create community
        CommunityAccount storage account = communityList[nextCommunityId];

        account.communityId = nextCommunityId;
        account.name = _name;
        account.description = _description;
        account.externalURL = _externalURL;

        // add admins for that community
        adminList[nextCommunityId][msg.sender] = true;

        // update next community id
        nextCommunityId++;
    }

    /**
     * @dev Adds an admin to a community.
     * @param _communityId The identifier of the community.
     * @param _address The address of the admin to be added.
     */
    function addAdmin(
        uint256 _communityId,
        address _address
    ) public onlyAdmin(_communityId) {
        adminList[_communityId][_address] = true;
    }

    /**
     * @dev Removes an admin from a community.
     * @param _communityId The identifier of the community.
     * @param _address The address of the admin to be removed.
     */
    function removeAdmin(
        uint256 _communityId,
        address _address
    ) public onlyAdmin(_communityId) {
        adminList[_communityId][_address] = false;
    }

    /**
     * @dev Allows a user to join a community.
     * @param _communityId The identifier of the community.
     */
    function joinCommunity(
        uint256 _communityId
    ) public checkCommunityAccess(_communityId) {
        // community member list
        memberList[_communityId][msg.sender] = MemberAccount(
            msg.sender,
            0,
            false,
            true
        );

        // update members profile
        userCommunityList[msg.sender].push(
            CommunityInfo(_communityId, communityList[_communityId].name, true)
        );
    }

    /**
     * @dev Retrieves the list of communities that the user has joined.
     * @return An array of CommunityInfo struct representing the user's joined communities.
     */
    function getUserCommunities() public view returns (CommunityInfo[] memory) {
        return userCommunityList[msg.sender];
    }

    /**
     * @dev Allows a user to leave a community.
     * @param _communityId The identifier of the community.
     */
    function leaveCommunity(
        uint256 _communityId
    ) public checkCommunityAccess(_communityId) {
        // update data in member list
        memberList[_communityId][msg.sender].isMember = false;

        // update data in user profile
        for (uint256 i = 0; i < userCommunityList[msg.sender].length; i++) {
            if (_communityId == userCommunityList[msg.sender][i].communityId) {
                userCommunityList[msg.sender][i].isMember = false;
            }
        }
    }

    /**
     * @dev Updates the community score of a user.
     * @param _communityId The identifier of the community.
     * @param _address The address of the user.
     */
    function updateCommunityScore(
        uint256 _communityId,
        address _address
    ) public checkCommunityAccess(_communityId) {
        memberList[_communityId][_address].communityScore += spendAmount;
        socialScore.updateSocialScore(_address, spendAmount);
    }

    /**
     * @dev Creates a new event within a community.
     * @param _communityId The identifier of the community.
     * @param _name The name of the event.
     * @param _description The description of the event.
     * @param _externalURL The external URL of the event.
     */
    function createEvent(
        uint256 _communityId,
        string memory _name,
        string memory _description,
        string memory _externalURL
    ) public checkCommunityAccess(_communityId) {
        eventList[nextEventId] = EventAccount(
            nextEventId,
            _communityId,
            _name,
            _description,
            _externalURL
        );

        nextEventId++;
    }

    /**
     * @dev Updates the event score of a user within a community.
     * @param _communityId The identifier of the community.
     * @param _eventId The identifier of the event.
     * @param _address The address of the user.
     */
    function updateEventScore(
        uint256 _communityId,
        uint256 _eventId,
        address _address
    ) public checkCommunityAccess(_communityId) checkEventAccess(_eventId) {
        eventMemberList[_eventId][_address].eventScore += spendAmount;
        uint256 communityId = eventList[_eventId].communityId;
        updateCommunityScore(communityId, _address);
    }

    /**
     * @dev Allows a user to apply for an event within a community.
     * @param _communityId The identifier of the community.
     * @param _eventId The identifier of the event.
     * @return The identifier of the event application.
     */
    function applyForEvent(
        uint256 _communityId,
        uint256 _eventId
    ) public checkCommunityAccess(_communityId) returns (uint256) {
        applicationList.push(
            EventApplication(_eventId, msg.sender, Status.PENDING)
        );

        return applicationList.length;
    }

    /**
     * @dev Approves an event application within a community.
     * @param _communityId The identifier of the community.
     * @param _eventId The identifier of the event.
     * @param _address The address of the user.
     * @param _applicationId The identifier of the event application.
     */
    function approveApplication(
        uint256 _communityId,
        uint256 _eventId,
        address _address,
        uint256 _applicationId
    ) public onlyAdmin(_communityId) {
        eventMemberList[_eventId][_address].isMember = true;
        eventMemberList[_eventId][_address].walletAddress = _address;

        applicationList[_applicationId].status = Status.APPROVED;
    }

    /**
     * @dev Rejects an event application within a community.
     * @param _communityId The identifier of the community.
     * @param _applicationId The identifier of the event application.
     */
    function rejectApplication(
        uint256 _communityId,
        uint256 _applicationId
    ) public onlyAdmin(_communityId) {
        applicationList[_applicationId].status = Status.REJECTED;
    }

    /**
     * @dev Allows a user to leave an event within a community.
     * @param _communityId The identifier of the community.
     * @param _eventId The identifier of the event.
     * @param _address The address of the user.
     */
    function leaveEvent(
        uint256 _communityId,
        uint256 _eventId,
        address _address
    ) public checkCommunityAccess(_communityId) checkEventAccess(_eventId) {
        eventMemberList[_eventId][_address].isMember = false;
    }
}
