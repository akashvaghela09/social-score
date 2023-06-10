// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Project {
    struct Vote {
        address voter;
        bool isPositiveVote;
    }

    struct ProjectData {
        uint256 id;
        string title;
        uint256 communityId;
        uint256 reputationPoints;
        mapping(address => bool) hasVoted;
        Vote[] votes;
    }

    mapping(uint256 => ProjectData) public projects;
    uint256 public nextProjectId;
    address public communityContract;

    event UserUpvotedInProject(uint256 indexed projectId, address indexed user);
    event UserDownvotedInProject(
        uint256 indexed projectId,
        address indexed user
    );

    modifier onlyCommunityContract() {
        require(
            msg.sender == communityContract,
            "Caller is not the Community contract"
        );
        _;
    }

    constructor(address _communityContract) {
        communityContract = _communityContract;
    }

    function createProject(string calldata title)
        external
        onlyCommunityContract
    {
        ProjectData storage newProject = projects[nextProjectId];
        newProject.id = nextProjectId;
        newProject.title = title;
        newProject.communityId = nextProjectId; // Can be updated to reference community
        newProject.reputationPoints = 0;

        nextProjectId++;
    }

    function upvoteUserInProject(uint256 projectId, address user)
        external
        onlyCommunityContract
    {
        ProjectData storage project = projects[projectId];

        require(project.communityId != 0, "Project does not exist");
        require(
            !project.hasVoted[user],
            "User has already voted in the project"
        );

        project.votes.push(Vote({voter: msg.sender, isPositiveVote: true}));

        project.hasVoted[user] = true;
        project.reputationPoints++;

        emit UserUpvotedInProject(projectId, user);
    }

    function downvoteUserInProject(uint256 projectId, address user)
        external
        onlyCommunityContract
    {
        ProjectData storage project = projects[projectId];

        require(project.communityId != 0, "Project does not exist");
        require(
            !project.hasVoted[user],
            "User has already voted in the project"
        );

        project.votes.push(Vote({voter: msg.sender, isPositiveVote: false}));

        project.hasVoted[user] = true;
        project.reputationPoints--;

        emit UserDownvotedInProject(projectId, user);
    }
}
