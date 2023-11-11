// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@bnb-chain/greenfield-contracts/contracts/interface/IERC721Nontransferable.sol";
import "../node_modules/@bnb-chain/greenfield-contracts/contracts/interface/IERC1155Nontransferable.sol";
import "./BucketApp.sol";
import "./ObjectApp.sol";
import "./GroupApp.sol";

interface IERC1155Mintable {
    function mint(address to, uint256 id, uint256 amount, bytes memory data) external;
}

contract Marketplace is AccessControl, BucketApp, ObjectApp, GroupApp {

    // greenfield system contracts
    address public constant CROSS_CHAIN = 0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7;
    address public constant GROUP_HUB = 0x50B3BF0d95a8dbA57B58C82dFDB5ff6747Cc1a9E;
    address public constant GROUP_TOKEN = 0x7fC61D6FCA8D6Ea811637bA58eaf6aB17d50c4d1;
    address public constant MEMBER_TOKEN = 0x43bdF3d63e6318A2831FE1116cBA69afd0F05267;

    mapping(uint256 => uint256) objectPrice; //object id to price mapping
    mapping(uint256 => string) objectName; //object id to name mapping
    mapping(uint256 => uint256) objectGroup; //object id to group id mapping
    mapping(uint256 => address) objectOwner; //object id to seller mapping;
    mapping(uint256 => address) objectBucket; //object id to bucketmapping;
    mapping(uint256 => string) groupName; //group id to name mapping;
    mapping(uint256 => address) groupOwner; //group owner to seller mapping;
    mapping(string => address) bucketOwner; //group
   

    mapping(address => uint256) public balances; //Keeps track of all seller balances


    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function initialize(
        address _initAdmin,
        address _fundWallet,
        uint256 _feeRate,
        uint256 _callbackGasLimit,
        uint8 _failureHandleStrategy
    ) public initializer {
        require(_initAdmin != address(0), "MarketPlace: invalid admin address");
        _grantRole(DEFAULT_ADMIN_ROLE, _initAdmin);

        transferGasLimit = 2300;
        fundWallet = _fundWallet;
        feeRate = _feeRate;

        __base_app_init_unchained(CROSS_CHAIN, _callbackGasLimit, _failureHandleStrategy);
        __group_app_init_unchained(GROUP_HUB);
    }

    function greenfieldCall(
        uint32 status,
        uint8 resourceType,
        uint8 operationType,
        uint256 resourceId,
        bytes calldata callbackData
    ) external override(BucketApp, ObjectApp, GroupApp) {
        require(
            msg.sender == bucketHub || msg.sender == objectHub || msg.sender == groupHub,
            "invalid caller"
        );

        if (resourceType == RESOURCE_BUCKET) {
            _bucketGreenfieldCall(status, operationType, resourceId, callbackData);
        } else if (resourceType == RESOURCE_OBJECT) {
            _objectGreenfieldCall(status, operationType, resourceId, callbackData);
        } else if (resourceType == RESOURCE_GROUP) {
            _groupGreenfieldCall(status, operationType, resourceId, callbackData);
        } else {
            revert(string.concat("EbookShop: ", ERROR_INVALID_RESOURCE));
        }
    }

    function list(uint256 _objectId, uint256 _price) external { //good
        require(
            IERC721NonTransferable(objectToken).ownerOf(_objectId) == msg.sender,
            "must be owner"
        );
        require(_price > 0);
        //require sender owns token
        objectPrice[_objectId] = _price; //assign price to tokenId
        IERC1155Mintable(ebookToken).mint(msg.sender, _ebookId, 1, ""); //mints ownership token to creator
    }

    function createGroup(uint256 _objectId) public payable { //good
        require(
            IERC721NonTransferable(objectToken).ownerOf(_objectId) == msg.sender,
            "must be owner"
        );
        string memory name = string.concat("Purchasers of ", objectName[_objectId]);
        _createGroup(owner, name); //create group with owner 
    }

    function purchaseListing(uint256 _objectId) external payable {
        require(objectPrice[_objectId] > 0, "not listed yet");

        uint256 price = objectPrice[_objectId];
        require(msg.value >= price, "not enough payment");

        IERC1155Mintable(objectToken).mint(msg.sender, _objectId, 1, ""); //what is objectToken //sends proof of ownership to buyer.

        uint256 _groupId = objectGroup[_objectId];
        address _owner = IERC721NonTransferable(groupToken).ownerOf(_groupId);

        address[] memory _member = new address[](1);
        uint64[] memory _expiration = new uint64[](1);

        _member[0] = msg.sender;
        _expiration[0] = 0;
        _updateGroup(_owner, _groupId, GroupStorage.UpdateGroupOpType.AddMembers, _member, _expiration); //updates group permissions to include buyer, they can now download file

        balances[_owner] += price;

        emit ListingPurchased(_listingId, msg.sender, listing.price);
    }

    function disburseFunds(uint256 _amount) external { //take fee here
        require(_amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= amount;
        token.safeTransfer(msg.sender, _amount);
    }


    /////REGISTER ITEMS

    /**
     * @dev Register group resource that mirrored from GreenField to BSC.
     */
    function registerGroup(string calldata _groupName, uint256 tokenId) external {
        require(
            IERC721NonTransferable(groupToken).ownerOf(tokenId) == msg.sender,
            string.concat("EbookShop: ", ERROR_INVALID_CALLER)
        );
        require(bytes(name).length > 0, "invalid name");
        require(groupId[name] == 0, "group exists");

        groupName[tokenId] = name;
        groupId[name] = tokenId;
    }

    /**
     * @dev Register object resource that mirrored from GreenField to BSC.
     */
    function registerObject(
        string calldata _objectName,
        uint256 _objectId,
        string calldata _groupName,
        uint256 _groupId
    ) external {
        require(
            IERC721NonTransferable(objectToken).ownerOf(_objectId) == msg.sender,
            "invalid caller"
        );
        require(bytes(_objectName).length > 0, "invalid name");
        require(objectId[_objectName] == 0, "name already exists");

        objectOwner[_objectName] = objectId;

        if (_groupId != 0) {
            require(
                IERC721NonTransferable(groupToken).ownerOf(_groupId) == msg.sender,
                "invalid caller"
            );
            require(bytes(_groupName).length > 0, "invalid group name");

            groupName[_groupId] = _groupName;
            groupId[_groupName] = _groupId;

            groupEbook[_groupId] = _ebookId;
            ebookGroup[_ebookId] = _groupId;
        }
    }

    /**
     * @dev Register bucket resource that mirrored from GreenField to BSC.
     */
    function registerGroup(string calldata name, uint256 tokenId) external {
        require(
            IERC721NonTransferable(groupToken).ownerOf(tokenId) == msg.sender,
            "invalid caller"
        );
        require(bytes(name).length > 0, "invalid name");
        bucketOwner[tokenId] = msg.sender;
    }
}
