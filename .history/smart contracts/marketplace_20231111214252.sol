// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Marketplace {
    using SafeERC20 for IERC20;

    address public admin;
    IERC20 public token;  // Assuming you have a BNB-based token

    struct Listing {
        address creator;
        string fileHash;
        uint256 price;
        bool isAvailable;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;
    mapping(address => uint256) public balances;

    event ListingCreated(uint256 listingId, address creator, string fileHash, uint256 price);
    event ListingPurchased(uint256 listingId, address buyer, uint256 price);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address _admin, address _token) {
        admin = _admin;
        token = IERC20(_token);
    }

    function createListing(string memory _fileHash, uint256 _price) external {
        require(_price > 0, "Price must be greater than 0");

        uint256 listingId = nextListingId;
        nextListingId++;

        listings[listingId] = Listing({
            creator: msg.sender,
            fileHash: _fileHash,
            price: _price,
            isAvailable: true
        });

        emit ListingCreated(listingId, msg.sender, _fileHash, _price);
    }

    function purchaseListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];

        require(listing.isAvailable, "Listing not available");
        require(token.balanceOf(msg.sender) >= listing.price, "Insufficient funds");

        token.safeTransferFrom(msg.sender, listing.creator, listing.price);
        balances[listing.creator] += listing.price;
        listing.isAvailable = false;

        emit ListingPurchased(_listingId, msg.sender, listing.price);
    }

    function disburseFunds(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] 
        token.safeTransfer(msg.sender, _amount);
    }
}
