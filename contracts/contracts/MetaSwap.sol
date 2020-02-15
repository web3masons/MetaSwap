pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MetaSwap {
  using ECDSA for bytes32;

  struct AccountDetails {
      address burnerWallet;
      uint lastFrozen;
      bool isFrozen;
      bool inPrison;
      uint swapsCompleted;
  }

  mapping (address => AccountDetails) accountDetails;
  mapping (address => mapping (address => uint256)) balances;
  mapping (bytes32 => bool) completedSwaps;

  uint public constant claimWindowBlocks = 20; // 5 minutes
  uint public constant frozenBuffer = 8; // 2 minutes

  function getBalance(address account, address asset) public view returns (uint value) {
    return balances[account][asset];
  }
  function getAccountDetails(address account) public view returns (AccountDetails memory accountDetail) {
    return accountDetails[account];
  }
  function signerIsAllowed(address account, address signer) public view returns (bool allowed) {
    return signer == account || signer == accountDetails[account].burnerWallet;
  }
  function coldEnoughBlock(address account) public view returns (uint blocknumber) {
    return accountDetails[account].lastFrozen + claimWindowBlocks + frozenBuffer;
  }
  function isColdEnough(address account) public view  returns (bool coldEnough) {
    // TODO use safe math
    require(accountDetails[account].isFrozen, 'not frozen');
    require(block.number > coldEnoughBlock(account), 'not frozen for long enough');
    return true;
  }
  modifier frozen {
    // TODO use safe math
    require(isColdEnough(msg.sender), 'not cold enough; freeze and/or wait a bit');
    _;
  }
  function freeze() public returns (bool success) {
    accountDetails[msg.sender].lastFrozen = block.number;
    accountDetails[msg.sender].isFrozen = true;
    return true;
  }
  function unFreeze() public frozen returns (bool success) {
    accountDetails[msg.sender].isFrozen = false;
    return true;
  }
  // update settings for this account
  function configureAccount(address burnerWallet, bool done) public frozen returns (bool success) {
    accountDetails[msg.sender].burnerWallet = burnerWallet;
    if (done) {
      unFreeze();
    }
    return true;
  }
  function withdraw(address asset, uint amount) public frozen returns (bool success) {
    require(balances[msg.sender][asset] >= amount, 'not enough balance');
    if (asset == address(0)) {
      msg.sender.transfer(amount);
    } else {
      ERC20(asset).transfer(msg.sender, amount);
    }
    return true;
  }
  function depositToken(address asset, uint value) public returns (bool success) {
    ERC20(asset).transferFrom(msg.sender, address(this), value);
    balances[msg.sender][asset] = balances[msg.sender][asset] + value;
    return true;
  }
  function depositEther() public payable returns (bool success) {
    balances[msg.sender][address(0)] = balances[msg.sender][address(0)] + msg.value;
    return true;
  }
	function swap(
    address account,
    address payable receiver,
    address asset,
    uint256 amount,
    uint256 expirationBlock,
    bytes32 preImageHash,
    bytes32 preImage,
    bytes memory signature
  ) public returns(bool success) {
    // validate the metatransaction
    bytes memory blob = abi.encodePacked(
      address(this),
      account,
      receiver,
      asset,
      amount,
      expirationBlock,
      preImageHash
    );
    address signer = keccak256(blob).toEthSignedMessageHash().recover(signature);
    require(signer != address(0) && signerIsAllowed(account, signer), 'invalid signature');
    // now validate the swap itself
    require(sha256(abi.encodePacked(preImage)) == preImageHash, 'incorrect invoice');
    require(expirationBlock > block.number, 'swap expired');
    require(!completedSwaps[preImageHash], 'swap already claimed');
    // TODO this account's rate limiting rules (e.g. minimum balance, timelock)...

    // validated
    completedSwaps[preImageHash] = true;
    accountDetails[account].swapsCompleted = accountDetails[account].swapsCompleted + 1;
    // update balance
    balances[msg.sender][asset] = balances[msg.sender][asset] - amount;
    // send the funds...
    if (asset == address(0)) {
      receiver.transfer(amount);
    } else {
      ERC20(asset).transfer(receiver, amount);
    }
    // TODO reward the relayer for publishing a valid message
    return true;
  }
}