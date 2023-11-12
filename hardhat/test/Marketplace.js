const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("ethereum-waffle");
const { ERC721 } = require("@openzeppelin/contracts");

describe("Marketplace", function () {
  let marketplace;
  let owner;
  let user1;
  let user2;
  let objectToken;
  let groupToken;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();

    objectToken = await deployContract(owner, ERC721, ["ObjectToken", "OBJ"]);
    groupToken = await deployContract(owner, ERC721, ["GroupToken", "GRP"]);

    await marketplace.initialize(
      owner.address,
      objectToken.address,
      groupToken.address,
      groupToken.address,
      300000,
      0,
      owner.address
    );

    await objectToken.connect(owner).mint(owner.address, 1);
    await objectToken.connect(user1).mint(user1.address, 2);
  });

  describe("list", function () {
    it("should allow the owner to list an object", async function () {
      const listingTx = await marketplace.connect(owner).list(1, ethers.utils.parseEther("1.0"));
      await listingTx.wait();

      const objectPrice = await marketplace.objectPrice(1);
      expect(objectPrice).to.equal(ethers.utils.parseEther("1.0"));
    });

    it("should revert if non-owner tries to list an object", async function () {
      await expect(marketplace.connect(user1).list(1, ethers.utils.parseEther("1.0"))).to.be.revertedWith(
        "must be owner"
      );
    });

    it("should revert if listing price is zero", async function () {
      await expect(marketplace.connect(owner).list(1, 0)).to.be.revertedWith("Price must be greater than 0");
    });
  });

  describe("createGroup", function () {
    it("should allow the owner to create a group for an object", async function () {
      const createGroupTx = await marketplace.connect(owner).createGroup(1);
      await createGroupTx.wait();

      const groupId = await marketplace.objectGroup(1);
      expect(groupId).to.not.equal(0);

      const groupName = await marketplace.groupName(groupId);
      expect(groupName).to.equal("Purchasers of ");
    });

    it("should revert if non-owner tries to create a group", async function () {
      await expect(marketplace.connect(user1).createGroup(1)).to.be.revertedWith("must be owner");
    });
  });

  describe("purchaseListing", function () {
    beforeEach(async () => {
      await marketplace.connect(owner).list(1, ethers.utils.parseEther("1.0"));
      await marketplace.connect(owner).createGroup(1);
    });

    it("should allow a user to purchase a listed object", async function () {
      const purchaseTx = await marketplace.connect(user1).purchaseListing(1, { value: ethers.utils.parseEther("1.0") });
      await purchaseTx.wait();

      const user1Balance = await marketplace.balances(user1.address);
      expect(user1Balance).to.equal(ethers.utils.parseEther("1.0"));

      const user1ObjectBalance = await objectToken.balanceOf(user1.address, 1);
      expect(user1ObjectBalance).to.equal(1);

      const groupId = await marketplace.objectGroup(1);
      const user1InGroup = await marketplace.isMember(groupId, user1.address);
      expect(user1InGroup).to.equal(true);
    });

    it("should revert if the object is not listed", async function () {
      await expect(marketplace.connect(user1).purchaseListing(2, { value: ethers.utils.parseEther("1.0") })).to.be.revertedWith(
        "not listed yet"
      );
    });

    it("should revert if payment is insufficient", async function () {
      await expect(marketplace.connect(user1).purchaseListing(1, { value: ethers.utils.parseEther("0.5") })).to.be.revertedWith(
        "not enough payment"
      );
    });
  });

  describe("disburseFunds", function () {
    beforeEach(async () => {
      await marketplace.connect(owner).list(1, ethers.utils.parseEther("1.0"));
      await marketplace.connect(owner).createGroup(1);
      await marketplace.connect(user1).purchaseListing(1, { value: ethers.utils.parseEther("1.0") });
    });

    it("should allow a user to disburse their funds", async function () {
      const initialBalance = await ethers.provider.getBalance(user1.address);
      const disburseTx = await marketplace.connect(user1).disburseFunds(ethers.utils.parseEther("1.0"));
      await disburseTx.wait();

      const finalBalance = await ethers.provider.getBalance(user1.address);
      expect(finalBalance).to.be.above(initialBalance);
    });

    it("should revert if the amount is zero", async function () {
      await expect(marketplace.connect(user1).disburseFunds(0)).to.be.revertedWith("Amount must be greater than 0");
    });

    it("should revert if the user's balance is insufficient", async function () {
      await expect(marketplace.connect(user2).disburseFunds(ethers.utils.parseEther("1.0"))).to.be.revertedWith(
        "Amount exceeds balance"
      );
    });
  });

  // Add more test cases as needed for other functions and scenarios

  // ...

});
