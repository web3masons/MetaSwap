const ethers = require('ethers');
const { utils } = ethers;

const MetaSwap = artifacts.require("MetaSwap");

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

function generateMessage(contract, owner, receiver, asset, amount, expirationBlock, preImageHash) {
  const types = ['address', 'address', 'address', 'address', 'uint256', 'uint256', 'bytes32'];
  const values = [contract, owner, receiver, asset, amount, expirationBlock, preImageHash];
  return utils.solidityKeccak256(types, values);
}

contract('MetaSwap', (accounts) => {
  it('should be configured correctly', async () => {
    const metaSwap = await MetaSwap.deployed();
    assert.equal((await metaSwap.claimWindowBlocks.call()).valueOf(), 20, "incorrect minimum block window set");
    assert.equal((await metaSwap.frozenBuffer.call()).valueOf(), 8, "incorrect frozenBuffer set");
  });
  it('should accept ether deposits', async() => {
    const metaSwap = await MetaSwap.deployed();
    const value = 10;
    await metaSwap.depositEther({ value });
    assert.equal((await web3.eth.getBalance(metaSwap.address)), value, "ether was not received in contract");
    assert.equal((await metaSwap.getBalance.call(accounts[0], nullAddress)).valueOf(), value, "deposit was not credited");
  });
  it('settles valid swaps', async () => {
    const metaSwap = await MetaSwap.new();
    await metaSwap.depositEther({ value: 10 });
    await metaSwap.freeze();
    await waitFor(30);
    const recipient = accounts[3]
    await metaSwap.configureAccount(burner, true);
    const expiration = await web3.eth.getBlockNumber() + 20;
    const params = [
      accounts[0],
      recipient,
      nullAddress,
      3,
      expiration,
      examplePreImageHash
    ];
    const message = generateMessage(...[metaSwap.address].concat(params));
    const signature = await wallet.signMessage(utils.arrayify(message));
    // submit the swap
    await metaSwap.swap(...params.concat([examplePreImage, signature]));
    console.log(await metaSwap.getAccountDetails.call(accounts[0]));
    console.log(await web3.eth.getBalance(recipient));
  });
});
