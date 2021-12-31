var InstitutionManager = artifacts.require("./InstitutionManager.sol");


module.exports = function(deployer) {
  deployer.deploy(InstitutionManager);
};
