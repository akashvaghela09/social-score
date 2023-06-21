// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title SSToken
 * @dev This contract implements the Social Score Token (SS). It is an ERC20 token with additional functionalities.
 */
contract SSToken is ERC20, ERC20Burnable {
    uint256 public tokenPrice; // Price of each token in wei

    // Mapping to track the admin status of addresses
    mapping(address => bool) public adminList;

    // Event emitted when tokens are minted/bought
    event TokensMinted(address indexed buyer, uint256 amount);

    // Event emitted when the token price is updated
    event PriceUpdated(uint256 newPrice);

    constructor() ERC20("Social Score Token", "SS") {
        // Set initial token price to 1 wei
        tokenPrice = 1;

        // Deployer is assigned as the only admin
        adminList[msg.sender] = true;
    }

    /**
     * @dev Modifier to restrict access to admin-only functions.
     * @dev Reverts with an error message if the sender is not an admin.
     */
    modifier onlyAdmin() {
        require(adminList[msg.sender] == true, "Don't have access!!");
        _;
    }

    /**
     * @dev Allows users to purchase tokens by sending ETH.
     * @dev The amount of tokens to mint is calculated based on the token price and the ETH sent.
     */
    function buyTokens() external payable {
        uint256 tokenAmount = msg.value / tokenPrice; // Calculate the amount of tokens based on ETH sent
        _mint(msg.sender, tokenAmount); // Mint the purchased tokens and assign them to the buyer
        emit TokensMinted(msg.sender, tokenAmount); // Emit the TokensMinted event
    }

    /**
     * @dev Adds a new address to the admin list.
     * @param _address The address to be added as an admin.
     */
    function addAdmin(address _address) public onlyAdmin {
        adminList[_address] = true;
    }

    /**
     * @dev Removes admin access for a given address.
     * @param _address The address to have admin access removed.
     */
    function removeAdmin(address _address) public onlyAdmin {
        adminList[_address] = false;
    }

    /**
     * @dev Updates the token price.
     * @param _price The new token price in wei.
     */
    function updatePrice(uint256 _price) public onlyAdmin {
        tokenPrice = _price;
        emit PriceUpdated(_price); // Emit the PriceUpdated event
    }
}
