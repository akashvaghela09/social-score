// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract SSToken is ERC20, ERC20Burnable {
    uint256 public tokenPrice; // Price of each token in wei

    mapping(address => bool) public adminList;

    constructor() ERC20("Social Score Token", "SS") {
        tokenPrice = 1;
        adminList[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(adminList[msg.sender] == true, "Don't have access!!");

        _;
    }

    function buyTokens() external payable {
        uint256 tokenAmount = msg.value / tokenPrice; // Calculate the amount of tokens based on ETH sent
        _mint(msg.sender, tokenAmount); // Mint the purchased tokens and assign them to the buyer
    }

    function addAdmin(address _address) public onlyAdmin {
        adminList[_address] = true;
    }

    function removeAdmin(address _address) public onlyAdmin {
        adminList[_address] = false;
    }

    function updatePrice(uint56 _price) public onlyAdmin {
        tokenPrice = _price;
    }
}
