var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var InstitutionManager = artifacts.require("./InstitutionManager.sol");


module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(InstitutionManager);
};
