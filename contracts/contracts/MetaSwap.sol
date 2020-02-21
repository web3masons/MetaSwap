pragma solidity 0.5.16;

// TODO events etc
// TODO better naming converion

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MetaSwap {
  using ECDSA for bytes32;

  struct AccountDetails {
    uint32 nonce;
    address burnerWallet;
    uint lastPurgatory;
    uint lastFrozen;
    bool isFrozen;
  }

  mapping (address => AccountDetails) accountDetails;
  mapping (address => mapping (address => uint)) balances;
  mapping (bytes32 => bool) completedSwaps;

  uint public constant claimWindowBlocks = 20; // 5 minutes
  uint public constant frozenBuffer = 8; // 2 minutes
  uint public constant maximumSpendProportion = 5; // maximum spend of asset per swap
  uint public constant purgatoryDuration = 175000; // number of blocks funds get locked if you cheat (about 1 month)

  
  modifier frozen {
    require(isColdEnough(msg.sender), 'not cold enough; freeze and/or wait a bit');
    _;
  }


  function getBalance(address account, address asset) public view returns (uint value) {
    return balances[account][asset];
  }

  function getAccountDetails(address account) public view returns (
    uint32 nonce,
    address burnerWallet,
    uint lastPurgatory,
    uint lastFrozen,
    bool isFrozen,
    uint coldBlock
  ) {
    return (
      accountDetails[account].nonce,
      accountDetails[account].burnerWallet,
      accountDetails[account].lastPurgatory,
      accountDetails[account].lastFrozen,
      accountDetails[account].isFrozen,
      coldEnoughBlock(account)
    );
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

  function freeze() public returns (bool success) {
    accountDetails[msg.sender].lastFrozen = block.number;
    accountDetails[msg.sender].isFrozen = true;
    return true;
  }
  function unFreeze() public frozen returns (bool success) {
    accountDetails[msg.sender].isFrozen = false;
    return true;
  }
  function notInPurgatory(address account) public view returns (bool) {
    if (accountDetails[account].lastPurgatory == 0) {
      return true;
    }
    return (block.number - accountDetails[account].lastPurgatory) > purgatoryDuration;
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
    require(notInPurgatory(msg.sender), 'you are in purgatory!');
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

  function signatureIsValid(address account, bytes memory signature, bytes32 swapHash) private view returns (bool success) {
    address signer = swapHash.toEthSignedMessageHash().recover(signature);
    if (signer == address(0)) {
      return false;
    }
    return signer == account || signer == accountDetails[account].burnerWallet;
  }

  function transferFunds(address from, address payable to, address asset, uint amount) private returns (bool success) {
    balances[from][asset] = balances[from][asset] - amount;
    if (asset == address(0)) {
      to.transfer(amount);
    } else {
      ERC20(asset).transfer(to, amount);
    }
    return true;
  }

  function calculateMaxSpend(address account, address asset) public view returns (uint maxSpend) {
    return balances[account][asset] / maximumSpendProportion;
  }

  function isCheating(
    uint32 nonce,
    address account,
    address asset,
    uint amount,
    address relayerAsset,
    uint relayerAmount
  ) private returns (bool) {
    bool cheating = false;
    uint maxSpend = calculateMaxSpend(account, asset);
    uint relayMaxSpend = calculateMaxSpend(account, relayerAsset);
    // if the nonce is invalid (trying to double spend)
    if (nonce != accountDetails[account].nonce + 1) {
      cheating = true;
    }
    // trying to spend too much
    if (maxSpend < amount) {
      cheating = true;
    }
    // trying to spend too much
    if (relayMaxSpend < relayerAmount) {
      cheating = true;
    }
    // punish!
    if (cheating) {
      accountDetails[account].lastPurgatory = block.number;
      transferFunds(account, address(0xdeadbeef), asset, maxSpend);
      transferFunds(account, address(0xdeadbeef), relayerAsset, relayMaxSpend);
    }
    return cheating;
  }

	function swap(
    uint32 nonce,
    address account,
    address payable receiver,
    address asset,
    uint amount,
    uint expirationBlock,
    bytes32 preImageHash,
    address payable relayerAddress,
    address relayerAsset,
    uint relayerAmount,
    uint relayerExpirationBlock,
    bytes32 preImage,
    bytes memory signature
  ) public {
    bytes32 swapHash = keccak256(abi.encodePacked(
      address(this),
      nonce,
      account,
      receiver,
      asset,
      amount,
      expirationBlock,
      preImageHash,
      relayerAddress,
      relayerAsset,
      relayerAmount,
      relayerExpirationBlock
    ));
    require(completedSwaps[swapHash] != true, 'swap is already claimed');
    require(expirationBlock > block.number, 'swap os expired');
    require(notInPurgatory(account), 'account is in purgatory');
    require(signatureIsValid(account, signature, swapHash), 'invalid signature');
    // check if cheating
    if (isCheating(nonce, account, asset, amount, relayerAsset, relayerAmount)) {
      return;
    }
    // give priority to relayer if within deadline
    require(relayerExpirationBlock > block.number || msg.sender == relayerAddress, 'not priority relayer');
    require(sha256(abi.encodePacked(preImage)) == preImageHash, 'incorrect invoice');
    // validated!
    accountDetails[account].nonce = nonce;
    completedSwaps[swapHash] = true;
    transferFunds(account, relayerAddress, relayerAsset, relayerAmount);
    transferFunds(account, receiver, asset, amount);
    return;
  }
}