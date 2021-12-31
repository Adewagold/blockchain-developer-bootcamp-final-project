const InstitutionManager = artifacts.require("InstitutionManager");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("InstitutionManager", function ( accounts ) {
  it("should assert true", async function () {
    await InstitutionManager.deployed();
    return assert.isTrue(true);
  });

  beforeEach(async () => {
    instance = await InstitutionManager.new();

  });

  describe("Variables", () => {
    it("should have an owner", async () => {
      assert.equal(typeof instance.owner, 'function', "the contract has no owner");
    });

    it("should have a instititions array", async () => {
      assert.equal(typeof instance.institutions, 'function', "the contract has no institutions");
    });

    it("should have recordManager address", async () =>{
      assert.equal(typeof instance.recordManager, 'function', "It should have record manager");
    });

    it("should have remittanceAddresses address", async () =>{
      assert.equal(typeof instance.remittanceAddresses, 'function', "It should have remittanceAddresses");
    });

    it("should have centralAccounts", async () =>{
      assert.equal(typeof instance.centralAccounts, 'function', "It should have centralAccounts");
    });

    it("should have treasuryUserIndex", async () =>{
      assert.equal(typeof instance.treasuryUserIndex, 'function', "It should have treasuryUserIndex");
    });

    it("should have treasuryUsers", async () =>{
      assert.equal(typeof instance.treasuryUsers, 'function', "It should have treasuryUsers");
    });

    it("should have totalRevenue", async () =>{
      assert.equal(typeof instance.totalRevenue, 'function', "It should have totalRevenue");
    });

  });
  describe("Method Operations", ()=>{
    it("should add remittance address", async() =>{
      let institutionManager = await InstitutionManager.deployed();

      await instance.addRemittanceAddresses(accounts[0]);
      // Check remittance address
      let isARemittanceAddressEnabled = await instance.remittanceAddresses(accounts[0]);

      let remittanceIndex = await instance.remitanceAddressIndex();
      assert.isTrue(isARemittanceAddressEnabled);
      assert.equal(remittanceIndex, 1,  "Remittance index should be 1");
    });

    it("should disbaleRemittanceAddresses", async() =>{
      await instance.addRemittanceAddresses(accounts[0]);
      // Check remittance address
      await instance.disbaleRemittanceAddresses(accounts[0]);
      let isARemittanceAddressEnabled = await instance.remittanceAddresses(accounts[0]);

      let remittanceIndex = await instance.remitanceAddressIndex();
      assert.isTrue(!isARemittanceAddressEnabled);
      assert.equal(remittanceIndex, 1,  "Remittance index should be 1");
    });

    it("should create Institution", async() =>{
      let newInstitition = await instance.createInstitution("FRSC","Federal Road Safety", "1221","ade@gmail.com","090122111");
      // Check remittance address

      // let isARemittanceAddressEnabled = await instance.remittanceAddresses(accounts[0]);

      let institutionIndex = await instance.institutionIndex();

      assert.isTrue(true);
      assert.equal(institutionIndex, 1,  "Institution index should be 1");
    });

  });

  
  
});
