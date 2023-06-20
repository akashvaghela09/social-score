// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

interface ISocialScore {
    function updateSocialScore(address _address, int256 _points) external;
}

contract Community {
    struct MemberAccount {
        address walletAddress;
        int256 communityScore;
        bool isBanned;
        bool isMember;
    }

    struct CommunityAccount {
        uint256 id;
        string name;
        string description;
        string externalURL;
    }

    struct CommunityInfo {
        uint256 id;
        string name;
        bool isMember;
    }

    struct EventAccount {
        uint256 id;
        uint256 communityId;
        string name;
        string description;
        string externalURL;
    }

    struct EventMemberAccount {
        address walletAddress;
        int256 eventScore;
        bool isBanned;
        bool isMember;
    }

    enum Status {
        APPROVED,
        REJECTED,
        PENDING
    }

    struct EventApplication {
        uint256 eventId;
        address userAddress;
        Status status;
    }

    uint256 public nextCommunityId;
    uint256 public nextEventId;

    // communityId => admin status
    mapping(uint256 => mapping(address => bool)) public adminList;

    // communityId => user address => community member account
    mapping(uint256 => mapping(address => MemberAccount)) public memberList;

    // communityId => communityAccount
    mapping(uint256 => CommunityAccount) public communityList;

    // user address => communityInfo
    mapping(address => CommunityInfo[]) public userCommunityList;

    // event id => event account
    mapping(uint256 => EventAccount) public eventList;

    // event id => user address => event member account
    mapping(uint256 => mapping(address => EventMemberAccount))
        public eventMemberList;

    EventApplication[] public applicationList;

    ISocialScore private socialScore;
    int256 public spendAmount = 5;

    constructor(address _socialScoreAddress) {
        socialScore = ISocialScore(_socialScoreAddress);
    }

    function createCommunity(
        string memory _name,
        string memory _description,
        string memory _externalURL
    ) public {
        // create community
        CommunityAccount storage account = communityList[nextCommunityId];

        account.name = _name;
        account.description = _description;
        account.externalURL = _externalURL;

        // add admins for that community
        adminList[nextCommunityId][msg.sender] = true;

        // update next id
        nextCommunityId++;
    }

    function addAdmin(uint256 _id, address _address) public {
        adminList[_id][_address] = true;
    }

    function removeAdmin(uint256 _id, address _address) public {
        adminList[_id][_address] = false;
    }

    // here _id is community id
    // add member in community based on id provided
    function joinCommunity(uint256 _id) public {
        // community member list
        memberList[_id][msg.sender] = MemberAccount(msg.sender, 0, false, true);

        // update members profile
        userCommunityList[msg.sender].push(
            CommunityInfo(_id, communityList[_id].name, true)
        );
    }

    function getUserCommunities() public view returns (CommunityInfo[] memory) {
        return userCommunityList[msg.sender];
    }

    // here _id is community id
    // update relavent member data from member list and members profile
    function leaveCommunity(uint256 _id) public {
        // update data in member list
        memberList[_id][msg.sender].isMember = false;

        // update data in user profile
        for (uint256 i = 0; i < userCommunityList[msg.sender].length; i++) {
            if (_id == userCommunityList[msg.sender][i].id) {
                userCommunityList[msg.sender][i].isMember = false;
            }
        }
    }

    function updateCommunityScore(uint256 _id, address _address) public {
        memberList[_id][_address].communityScore += spendAmount;
        socialScore.updateSocialScore(_address, spendAmount);
    }

    function createEvent(
        uint256 _id,
        string memory _name,
        string memory _description,
        string memory _externalURL
    ) public {
        eventList[nextEventId] = EventAccount(
            nextEventId,
            _id,
            _name,
            _description,
            _externalURL
        );

        nextEventId++;
    }

    function updateEventScore(uint256 _eventId, address _address) public {
        eventMemberList[_eventId][_address].eventScore += spendAmount;
        uint256 communityId = eventList[_eventId].communityId;
        updateCommunityScore(communityId, _address);
    }

    function applyForEvent(uint256 _eventId) public returns (uint256) {
        applicationList.push(
            EventApplication(_eventId, msg.sender, Status.PENDING)
        );

        return applicationList.length;
    }

    function approveApplication(
        uint256 _eventId,
        address _address,
        uint256 _applicationId
    ) public {
        eventMemberList[_eventId][_address].isMember = true;
        eventMemberList[_eventId][_address].walletAddress = _address;

        applicationList[_applicationId].status = Status.APPROVED;
    }

    function rejectApplication(uint256 _applicationId) public {
        applicationList[_applicationId].status = Status.REJECTED;
    }

    function leaveEvent(uint256 _eventId, address _address) public {
        eventMemberList[_eventId][_address].isMember = false;
    }
}
