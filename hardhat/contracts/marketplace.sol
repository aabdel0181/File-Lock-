// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@bnb-chain/greenfield-contracts/contracts/interface/IERC721NonTransferable.sol";
import "../node_modules/@bnb-chain/greenfield-contracts/contracts/interface/IERC1155NonTransferable.sol";
import "./BucketApp.sol";
import "./ObjectApp.sol";
import "./GroupApp.sol";

interface IERC1155Mintable {
    function mint(address to, uint256 id, uint256 amount, bytes memory data) external;
}

contract Marketplace is BucketApp, ObjectApp, GroupApp {
    // system contract
    address public bucketToken = 0xF6CB188D3346de442b171d015202e605B0697A2a;
    address public objectToken = 0xc6a7192937961622D27956F412c4ce242F159311;
    address public groupToken = 0x7fC61D6FCA8D6Ea811637bA58eaf6aB17d50c4d1;
    address public constant cross_Chain = 0x57b8A375193b2e9c6481f167BaECF1feEf9F7d4B;
    address public constant group_Hub = 0x0Bf7D3Ed3F777D7fB8D65Fb21ba4FBD9F584B579;
    address public constant bucket_Hub = 0x5BB17A87D03620b313C39C24029C94cB5714814A;
    address public constant object_Hub = 0x1b059D8481dEe299713F18601fB539D066553e39;

    mapping(uint256 => uint256) objectPrice; //object id to price mapping
    mapping(uint256 => string) objectName; //object id to name mapping
    mapping(uint256 => uint256) objectGroup; //object id to group id mapping
    mapping(uint256 => address) objectOwner; //object id to seller mapping;
    mapping(uint256 => address) objectBucket; //object id to bucketmapping;
    mapping(uint256 => string) groupName; //group id to name mapping;
    mapping(uint256 => address) groupOwner; //group owner to seller mapping;
    mapping(string => address) bucketOwner; //group
   

    mapping(address => uint256) public balances; //Keeps track of all seller balances

    constructor() payable {
    }

    function greenfieldCall(
        uint32 status,
        uint8 resourceType,
        uint8 operationType,
        uint256 resourceId,
        bytes calldata callbackData
    ) external override(BucketApp, ObjectApp, GroupApp) {
        require(
            msg.sender == BUCKET_HUB || msg.sender == OBJECT_HUB || msg.sender == GROUP_HUB,
            "invalid caller"
        );

        if (resourceType == RESOURCE_BUCKET) {
            _bucketGreenfieldCall(status, operationType, resourceId, callbackData);
        } else if (resourceType == RESOURCE_OBJECT) {
            _objectGreenfieldCall(status, operationType, resourceId, callbackData);
        } else if (resourceType == RESOURCE_GROUP) {
            _groupGreenfieldCall(status, operationType, resourceId, callbackData);
        } else {
            revert("greenfieldcall error");
        }
    }

    function list(uint256 _objectId, string _objectName, uint256 _groupId, uint256 _groupName, uint256 _price) external { //called after purchase listing
        require(
            IERC721NonTransferable(objectToken).ownerOf(_objectId) == msg.sender,
            "must be owner"
        );
        //require item doesn't exist already
        require(_price > 0);
        //require sender owns token
        
        registerObject(_objectName, _objectId, _groupName, _groupId);
        objectPrice[_objectId] = _price; //assign price to tokenId
        IERC1155Mintable(objectToken).mint(msg.sender, _objectId, 1, ""); //mints ownership token to creator
    }

    function createBuckets(string calldata _name) external { 
        //creates bucket for a seller 
        //predefined name
        //default private
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
    }

    function disburseFunds(uint256 _amount) external { //take fee here
        require(_amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
        (bool success,) = msg.sender.call{value: _amount}("");
        require(success, "withdraw failed");
    }


    /////REGISTER ITEMS

    /**
     * @dev Register object resource that mirrored from GreenField to BSC.
     */
    function registerObject(
        string calldata _objectName,
        uint256 _objectId,
        string calldata _groupName,
        uint256 _groupId
    ) internal {
        require(
            IERC721NonTransferable(objectToken).ownerOf(_objectId) == msg.sender,
            "invalid caller"
        );
        require(bytes(_objectName).length > 0, "invalid name");

        objectOwner[_objectId] = msg.sender;

        if (_groupId != 0) {
            require(
                IERC721NonTransferable(groupToken).ownerOf(_groupId) == msg.sender,
                "invalid caller"
            );
            require(bytes(_groupName).length > 0, "invalid group name");

            groupName[_groupId] = _groupName;
            objectGroup[_objectId] = _groupId;
        }
    }

    function greenfieldCall(
        uint32 status,
        uint8 resourceType,
        uint8 operationType,
        uint256 resourceId,
        bytes calldata callbackData
    ) external override(BucketApp, ObjectApp, GroupApp) {
        require(
            msg.sender == BUCKET_HUB || msg.sender == OBJECT_HUB || msg.sender == GROUP_HUB,
            "invalid caller"
        );

        if (resourceType == RESOURCE_BUCKET) {
            _bucketGreenfieldCall(status, operationType, resourceId, callbackData);
        } else if (resourceType == RESOURCE_OBJECT) {
            _objectGreenfieldCall(status, operationType, resourceId, callbackData);
        } else if (resourceType == RESOURCE_GROUP) {
            _groupGreenfieldCall(status, operationType, resourceId, callbackData);
        } else {
            revert("greenfieldcall error");
        }
    }

    function list(uint256 _objectId, string _objectName, uint256 _groupId, uint256 _groupName, uint256 _price) external { //called after purchase listing
        require(
            IERC721NonTransferable(objectToken).ownerOf(_objectId) == msg.sender,
            "must be owner"
        );
        //require item doesn't exist already
        require(_price > 0);
        //require sender owns token
        
        registerObject(_objectName, _objectId, _groupName, _groupId);
        objectPrice[_objectId] = _price; //assign price to tokenId
        IERC1155Mintable(objectToken).mint(msg.sender, _objectId, 1, ""); //mints ownership token to creator
    }

    function createBuckets(string calldata _name) external { 
        //creates bucket for a seller 
        //predefined name
        //default private
    }

    function purchaseListing(uint256 _objectId) external payable {
        require(objectPrice[_objectId] > 0, "not listed yet");

        uint256 price = objectPrice[_objectId];
        require(msg.value >= price, "not enough payment");

        IERC1155Mintable(objectToken).mint(msg.sender, _objectId, 1, ""); //sends proof of ownership to buyer.

        uint256 _groupId = objectGroup[_objectId];
        address _owner = IERC721NonTransferable(groupToken).ownerOf(_groupId);

        address[] memory _member = new address[](1);
        uint64[] memory _expiration = new uint64[](1);

        _member[0] = msg.sender;
        _expiration[0] = 0;
        _updateGroup(_owner, _groupId, GroupStorage.UpdateGroupOpType.AddMembers, _member, _expiration); //updates group permissions to include buyer, they can now download file

        balances[_owner] += price;
    }

    function disburseFunds(uint256 _amount) external { //take fee here
        require(_amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
        (bool success,) = msg.sender.call{value: _amount}("");
        require(success, "withdraw failed");
    }


    /////REGISTER ITEMS

    /**
     * @dev Register object resource that mirrored from GreenField to BSC.
     */
    function registerObject(
        string calldata _objectName,
        uint256 _objectId,
        string calldata _groupName,
        uint256 _groupId
    ) internal {
        require(
            IERC721NonTransferable(objectToken).ownerOf(_objectId) == msg.sender,
            "invalid caller"
        );
        require(bytes(_objectName).length > 0, "invalid name");

        objectOwner[_objectId] = msg.sender;

        if (_groupId != 0) {
            require(
                IERC721NonTransferable(groupToken).ownerOf(_groupId) == msg.sender,
                "invalid caller"
            );
            require(bytes(_groupName).length > 0, "invalid group name");

            groupName[_groupId] = _groupName;
            objectGroup[_objectId] = _groupId;
        }
    }

}
