/**************************************************************
 * @title SocialScore
 * @version 1.0.0
 * @dev The SocialScore contract enables users to register, track social scores, and perform token-related operations.
 *      It provides functionality for user management, social score tracking, and token operations such as loading and spending tokens.
 **************************************************************/

// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./SSToken.sol";

/**
 * @title SocialScore
 * @dev The SocialScore contract enables users to register, track social scores, and perform token-related operations.
 */
contract SocialScore {
   /**
 * @struct User
 * @dev Represents a user in the SocialScore contract.
 */
    struct User {
        uint256 userId; // User's unique identifier
        address walletAddress; // User's wallet address
        int256 socialScore; // User's social score
        bool isBanned; // Flag indicating if the user is banned
        uint256 balance; // User's account balance in SS tokens
    }

    // user next id
    uint256 internal nextId;

    // user address => user struct
    mapping(address => User) public users;
    // admin address => bool / admin status
    mapping(address => bool) public admins;

    // SSToken contract
    SSToken private ssToken;

    // token burn quantity
    uint256 public burnQuantity = 5;

    /**
     * @dev Initializes the SocialScore contract.
     * @param _tokenAddress The address of the SSToken contract.
     */
    constructor(address _tokenAddress) {
        // deployer is assigned as the only admin
        admins[msg.sender] = true;

        // set token address
        ssToken = SSToken(_tokenAddress);
    }

    /**
     * @dev Modifier to restrict access to admin-only functions.
     */
    modifier onlyAdmin() {
        require(admins[msg.sender] == true, "Don't have access!!");
        _;
    }

    /**
     * @dev Modifier to check if user is a registered member and not banned.
     */
    modifier checkUserAccess(address _address) {
        require(users[_address].walletAddress != address(0), "Not a member!!");
        require(users[_address].isBanned == false, "User banned!!");
        _;
    }

    /**
     * @dev Adds a new admin.
     * @param _address The address to be added as an admin.
     */
    function addAdmin(address _address) public onlyAdmin {
        admins[_address] = true;
    }

    /**
     * @dev Removes an admin.
     * @param _address The address to have admin status removed.
     */
    function removeAdmin(address _address) public onlyAdmin {
        admins[_address] = false;
    }

    /**
     * @dev Registers a new user.
     * @dev Reverts if the sender is already registered.
     */
    function register() public {
        require(
            users[msg.sender].walletAddress == address(0),
            "Already registered!!"
        );

        User storage newUser = users[msg.sender];
        newUser.userId = nextId;
        newUser.walletAddress = msg.sender;
        newUser.socialScore = 0;
        nextId++;
    }

    /**
     * @dev Bans a user.
     * @param _address The address of the user to be banned.
     */
    function banUser(
        address _address
    ) public onlyAdmin checkUserAccess(_address) {
        users[_address].isBanned = true;
    }

    /**
     * @dev Unbans a user.
     * @param _address The address of the user to be unbanned.
     */
    function unBanUser(address _address) public onlyAdmin {
        require(users[_address].walletAddress != address(0), "Not a member!!");
        users[_address].isBanned = false;
    }

    /**
     * @dev Retrieves the social score of a user.
     * @param _address The address of the user.
     * @return The social score of the user.
     */
    function getSocialScore(
        address _address
    ) public view checkUserAccess(_address) returns (int256) {
        return users[_address].socialScore;
    }

    /**
     * @dev Loads user's account with SSTokens by transferring ETH to the contract.
     * @dev Reverts if the sender is not a registered member or is banned.
     */
    function loadAccount() public payable checkUserAccess(msg.sender) {
        ssToken.transferFrom(msg.sender, address(this), msg.value);
        users[msg.sender].balance += msg.value;
    }

    /**
     * @dev Spends SSTokens from the user's account.
     * @param _address The address of the user whose tokens will be spent.
     * @dev Reverts if the sender is not a registered member or is banned.
     */
    function spendTokens(address _address) public checkUserAccess(msg.sender) {
        users[_address].balance -= burnQuantity;
    }

    /**
     * @dev Retrieves the balance of the user's account at the SocialScore contract.
     * @return The balance of the user's account.
     * @dev Reverts if the sender is not a registered member or is banned.
     */
    function balanceAtSocialScore()
        public
        view
        checkUserAccess(msg.sender)
        returns (uint256)
    {
        return users[msg.sender].balance;
    }

    /**
     * @dev Retrieves the balance of SSTokens in the user's wallet.
     * @return The balance of SSTokens in the user's wallet.
     * @dev Reverts if the sender is not a registered member or is banned.
     */
    function balanceOf()
        public
        view
        checkUserAccess(msg.sender)
        returns (uint256)
    {
        return ssToken.balanceOf(msg.sender);
    }

    /**
     * @dev Updates the social score of a user by a given number of points.
     * @param _address The address of the user.
     * @param _points The number of points to update the social score by.
     * @dev Reverts if the sender is not a registered member or is banned.
     */
    function updateSocialScore(
        address _address,
        int256 _points
    ) public checkUserAccess(_address) {
        users[_address].socialScore += _points;
        spendTokens(_address);
    }
}
