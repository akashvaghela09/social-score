// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SSBadge
 * @dev This contract represents the SSBadge non-fungible token (NFT). It extends the ERC721 standard and provides additional functionalities.
 */
contract SSBadge is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    /**
     * @dev Initializes the SSBadge contract.
     */
    constructor() ERC721("SSBadge", "SSB") {}

    /**
     * @dev Mints a new SSBadge token and assigns it to the specified address.
     * @param to The address to assign the minted token to.
     * @param uri The URI associated with the token's metadata.
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Hook function that is called before a token transfer occurs.
     * @param from The address from which the tokens are transferred.
     * @param to The address to which the tokens are transferred.
     * @param firstTokenId The first token ID in the batch of transferred tokens.
     * @param batchSize The number of tokens being transferred.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0), "Token Transfer is blocked");
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    /**
     * @dev Burns a specific token.
     * @param tokenId The ID of the token to be burned.
     */
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    /**
     * @dev Returns the URI for a given token ID.
     * @param tokenId The ID of the token.
     * @return The URI string.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Checks if a given interface is supported by this contract.
     * @param interfaceId The interface identifier.
     * @return True if the interface is supported, false otherwise.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
