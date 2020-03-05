const ethers = require('ethers');
const crypto = require('crypto');
const { utils } = ethers;

const MetaSwap = artifacts.require("MetaSwap");
const ERC20 = artifacts.require("ERC20Mock");

function randomAddress() {
  return `0x${crypto.randomBytes(20).toString('hex')}`;
}
const nullAddress = `0x${new Array(40).fill(0).join('')}`;
const burnAddress = `0x${new Array(37).fill(0).join('')}Bad`;
const examplePreImage = "0x561c9f2cc0e720388ff4e57611e7bce3d0b3d5b44563b15486646372b0f4ffc9";
const examplePreImageHash = "0x99fdc2e2d58d8e772cd819bd3ca41bbca56cc36dfc07e4bc97d7ed14bf2d2288";
const testPk = "0x0123456789012345678901234567890123456789012345678901234567890123";
const wallet = new ethers.Wallet(testPk);
const signer = wallet.address;

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

/*
  HASH ORDER:
  address(this),
  addressValues[0], // account
  addressValues[1], // recipient
  addressValues[2], // asset
  addressValues[3], // relayerAddress
  addressValues[4], // relayerAsset
  uintVales[0], // nonce
  uintVales[1], // amount
  uintVales[2], // expiration
  uintVales[3], // relayerAmount
  uintVales[4], // relayerExpiration
  bytes32Vals[0] // preImageHash
  bytes32Vals[1], // preImage
*/
async function formatParams(p) {
  const params = [p.contractAddress, p.account, p.recipient, p.asset, p.relayerAddress, p.relayerAsset, p.nonce, p.amount, p.expirationTime, p.relayerAmount, p.relayerExpirationTime, p.preImageHash]
  const types = ['address', 'address', 'address', 'address', 'address', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'bytes32'];
  const message = utils.solidityKeccak256(types, params);
  const signature = await wallet.signMessage(utils.arrayify(message));
  return [
    [p.account, p.recipient, p.asset, p.relayerAddress, p.relayerAsset],
    [p.nonce, p.amount, p.expirationTime, p.relayerAmount, p.relayerExpirationTime],
    [p.preImageHash, p.preImage],
    signature
  ]
}

contract('MetaSwap', (accounts) => {
  describe('setup', () => {
    it('should be configured correctly', async () => {
      const metaSwap = await MetaSwap.deployed();
      const res = await metaSwap.getContractDetails.call();
      assert.equal(res.cooldownTime, 5 * 60);
      assert.equal(res.maximumSpend, 5);
      assert.equal(res.etherAddress, nullAddress);
      assert.equal(res.burnAddress, burnAddress);
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
      assert.equal(await metaSwap.getBalance.call(nullAddress, accounts[0]), value, "deposit was not credited");
    });
    it('should accept token deposits', async() => {
      const tokens = 50;
      const erc20 = await ERC20.new(accounts[0], tokens);
      await erc20.approve(metaSwap.address, tokens);
      await metaSwap.depositToken(erc20.address, tokens);
      assert.equal(await metaSwap.getBalance.call(erc20.address, accounts[0]), tokens, "deposit was not credited");
    });
  })
  describe("swap", () => {
    let metaSwap, params;
    beforeEach(async() => {
      recipient = randomAddress();
      metaSwap = await MetaSwap.new();
      // await metaSwap.cooldown();
      // await waitFor(6 * 60);
      await metaSwap.configureAccount(signer, true);
      expires = 999999999999
      params = {
        preImageHash: examplePreImageHash,
        preImage: examplePreImage,
        nonce: 1,
        amount: 5,
        relayerAmount: 2,
        account: accounts[0],
        asset: nullAddress,
        relayerAddress: accounts[1],
        relayerAsset: nullAddress,
        contractAddress: metaSwap.address,
        expirationTime: expires + 20,
        relayerExpirationTime: expires + 5,
        recipient: randomAddress(),
      }
    });
    it("settles valid ether swaps", async () => {
      const deposit = 200;
      const expectedBalance = deposit - params.amount - params.relayerAmount;
      await metaSwap.depositEther({ value: deposit });
      const methodParams = await formatParams(params);
      await metaSwap.swap(...methodParams, { from: params.relayerAddress });
      assert.equal(await metaSwap.getBalance.call(params.asset, params.account), expectedBalance, 'sender balance incorrect');
      assert.equal(await web3.eth.getBalance(params.recipient), params.amount, 'recipient balance incorrect');
    });
    it("settles valid token swaps", async () => {
      const deposit = 200;
      const expectedBalance = deposit - params.amount - params.relayerAmount;
      const erc20 = await ERC20.new(params.account, deposit);
      await erc20.approve(metaSwap.address, deposit);
      await metaSwap.depositToken(erc20.address, deposit);
      params.asset = erc20.address;
      params.relayerAsset = erc20.address;
      const methodParams = await formatParams(params);
      await metaSwap.swap(...methodParams, { from: params.relayerAddress });
      assert.equal(await metaSwap.getBalance.call(params.asset, params.account), expectedBalance, 'sender balance incorrect');
      assert.equal(await erc20.balanceOf.call(params.recipient), params.amount, 'recipient balance incorrect');
    });
  });
});
