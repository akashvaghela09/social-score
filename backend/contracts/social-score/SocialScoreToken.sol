// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SocialScoreToken is ERC20 {
    uint public tokenPrice;  // Price of each token in wei

    constructor(uint _tokenPrice) ERC20("Social Score Token", "SS") {
        tokenPrice = _tokenPrice;
    }

    function buyTokens() external payable {
        uint tokenAmount = msg.value / tokenPrice;  // Calculate the amount of tokens based on ETH sent
        _mint(msg.sender, tokenAmount);  // Mint the purchased tokens and assign them to the buyer
    }
}
