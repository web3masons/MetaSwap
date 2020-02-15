const ethers = require('ethers');
const crypto = require('crypto');
const { utils } = ethers;

const MetaSwap = artifacts.require("MetaSwap");
const ERC20 = artifacts.require("ERC20Mock");

function randomAddress() {
  return `0x${crypto.randomBytes(20).toString('hex')}`;
}
const nullAddress = `0x${new Array(40).fill(0).join('')}`;
const examplePreImage = "0x561c9f2cc0e720388ff4e57611e7bce3d0b3d5b44563b15486646372b0f4ffc9";
const examplePreImageHash = "0x99fdc2e2d58d8e772cd819bd3ca41bbca56cc36dfc07e4bc97d7ed14bf2d2288";
const testPk = "0x0123456789012345678901234567890123456789012345678901234567890123";
const wallet = new ethers.Wallet(testPk);
const burner = wallet.address;

const waitFor = async n => {
  await Promise.all(
    [...Array(n).keys()].map(i =>
      new Promise((resolve) => {
        web3.currentProvider.send({
          jsonrpc: "2.0",
          method: "evm_mine",
          id: i
        }, resolve);
      })
    )
  );
};

function createSignature(...params) {
  // [contract, owner, receiver, asset, amount, expirationBlock, preImageHash];
  const types = ['address', 'address', 'address', 'address', 'uint256', 'uint256', 'bytes32'];
  const message = utils.solidityKeccak256(types, params);
  return wallet.signMessage(utils.arrayify(message));

}

contract('MetaSwap', (accounts) => {
  describe('setup', () => {
    it('should be configured correctly', async () => {
      const metaSwap = await MetaSwap.deployed();
      assert.equal(await metaSwap.claimWindowBlocks.call(), 20, "incorrect minimum block window set");
      assert.equal(await metaSwap.frozenBuffer.call(), 8, "incorrect frozenBuffer set");
    });
  })
  describe('deposit', () => {
    let metaSwap;
    beforeEach(async () => {
      metaSwap = await MetaSwap.new();
    })
    it('should accept ether deposits', async() => {
      const value = 10;
      await metaSwap.depositEther({ value });
      assert.equal(await web3.eth.getBalance(metaSwap.address), value, "ether was not received in contract");
      assert.equal(await metaSwap.getBalance.call(accounts[0], nullAddress), value, "deposit was not credited");
    });
    it('should accept token deposits', async() => {
      const tokens = 50;
      const erc20 = await ERC20.new(accounts[0], tokens);
      await erc20.approve(metaSwap.address, tokens);
      await metaSwap.depositToken(erc20.address, tokens);
      assert.equal(await metaSwap.getBalance.call(accounts[0], erc20.address), tokens, "deposit was not credited");
    });
  })
  describe("swap", () => {
    let metaSwap, recipient;
    beforeEach(async() => {
      recipient = randomAddress();
      metaSwap = await MetaSwap.new();
      await metaSwap.freeze();
      await waitFor(30);
      await metaSwap.configureAccount(burner, true);
      expiration = (await web3.eth.getBlockNumber()) + 20;
    });
    it("settles valid ether swaps", async () => {
      const value = 10;
      await metaSwap.depositEther({ value });
      const params = [
        accounts[0],
        recipient,
        nullAddress,
        value,
        expiration,
        examplePreImageHash
      ];
      const signature = await createSignature(metaSwap.address, ...params);
      await metaSwap.swap(...params, examplePreImage, signature);
      assert.equal(await metaSwap.getBalance.call(accounts[0], nullAddress), 0, 'sender balance incorrect');
      assert.equal(await web3.eth.getBalance(recipient), value, 'recipient balance incorrect');
    });
    it("settles valid token swaps", async () => {
      const tokens = 20;
      const erc20 = await ERC20.new(accounts[0], tokens);
      await erc20.approve(metaSwap.address, tokens);
      await metaSwap.depositToken(erc20.address, tokens);
      const params = [
        accounts[0],
        recipient,
        erc20.address,
        tokens,
        expiration,
        examplePreImageHash
      ];
      const signature = await createSignature(metaSwap.address, ...params);
      await metaSwap.swap(...params, examplePreImage, signature);
      assert.equal(await metaSwap.getBalance.call(accounts[0], erc20.address), 0, 'sender balance incorrect');
      assert.equal(await erc20.balanceOf.call(recipient), tokens, 'recipient balance incorrect');
    });

  });
});
