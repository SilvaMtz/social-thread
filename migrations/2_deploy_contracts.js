var SocialThread = artifacts.require("./SocialThread.sol");

module.exports = function(deployer) {
  deployer.deploy(SocialThread);
}