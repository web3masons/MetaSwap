const MetaSwap = artifacts.require("MetaSwap");
const ERC20Mock = artifacts.require("ERC20Mock");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(MetaSwap);
  deployer.deploy(ERC20Mock, accounts[0], "100000000000000000");
};
