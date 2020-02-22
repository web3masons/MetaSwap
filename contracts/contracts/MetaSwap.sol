pragma solidity >=0.5.16;

// TODO fix the pagma in production
// TODO events etc
// TODO safemath
// change block to timestamps

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MetaSwap {
  using ECDSA for bytes32;

  struct AccountDetails {
    uint nonce;
    address signerWallet;
    uint cooldownStart;
    bool warmupTriggered;
  }

  mapping (address => AccountDetails) _accountDetails;
  mapping (address => mapping (address => uint)) _balances;
  mapping (bytes32 => bool) _completedSwaps;
  mapping (bytes32 => bytes32) _revealedHashes;

  uint constant _claimWindow = 5 * 60; // 5 minutes
  uint constant _cooldownBuffer = 2 * 60; // 2 minutes
  uint constant _maximumSpend = 5; // maximum spend of asset per swap (balance / maximumSpend)
  address constant _etherAddress = address(0);
  address payable constant _burnAddress = address(0xbad);

  modifier frozen {
    require(getIsFrozen(msg.sender), 'not cold enough; freeze and/or wait a bit');
    _;
  }

  function getContractDetails() public view returns (
    uint claimWindow,
    uint cooldownBuffer,
    uint maximumSpend,
    address etherAddress,
    address burnAddress
  ) {
    return (
      _claimWindow,
      _cooldownBuffer,
      _maximumSpend,
      _etherAddress,
      _burnAddress
    );
  }

  function getAccountDetails(address _account) public view returns (
    uint nonce,
    address signerWallet,
    uint cooldownStart,
    bool warmupTriggered,
    uint frozenTime,
    bool isFrozen
  ) {
    return (
      _accountDetails[_account].nonce,
      _accountDetails[_account].signerWallet,
      _accountDetails[_account].cooldownStart,
      _accountDetails[_account].warmupTriggered,
      getFrozenTime(_account),
      getIsFrozen(_account)
    );
  }

  function getBalance(address _asset, address _account) public view returns (uint balance) {
    return _balances[_account][_asset];
  }

  function getFrozenTime(address _account) public view returns (uint frozenBlockNumber) {
    return _accountDetails[_account].cooldownStart + _claimWindow + _cooldownBuffer;
  }

  function getIsFrozen(address _account) public view returns (bool isFrozen) {
    return !_accountDetails[_account].warmupTriggered && block.timestamp > getFrozenTime(_account);
  }

  function getSignatureIsValid(address _account, bytes memory _signature, bytes32 _messageHash) public view returns (bool signatureIsValid) {
    address signer = _messageHash.toEthSignedMessageHash().recover(_signature);
    if (signer == address(0)) {
      return false;
    }
    return signer == _account || signer == _accountDetails[_account].signerWallet;
  }

  function getMaxSpend(address _account, address _asset) public view returns (uint maxSpend) {
    return _balances[_account][_asset] / _maximumSpend;
  }

  function getMessageHash(
    address[5] memory _addressVals,
    uint[5] memory _uintVals,
    bytes32[2] memory _bytes32Vals
  ) public view returns (bytes32 _messageHash) {
    return keccak256(abi.encodePacked(
      address(this),
      _addressVals[0], // account
      _addressVals[1], // receiver
      _addressVals[2], // asset
      _addressVals[3], // relayerAddress
      _addressVals[4], // relayerAsset
      _uintVals[0], // nonce
      _uintVals[1], // amount
      _uintVals[2], // expiration
      _uintVals[3], // relayerAmount
      _uintVals[4], // relayerExpiration
      _bytes32Vals[0] // preImageHash
      // _bytes32Vals[1], // preImage
    ));
  }

  function cooldown() public returns (bool success) {
    _accountDetails[msg.sender].cooldownStart = block.timestamp;
    _accountDetails[msg.sender].warmupTriggered = false;
    return true;
  }

  function warmUp() public frozen returns (bool success) {
    _accountDetails[msg.sender].warmupTriggered = true;
    return true;
  }

  function configureAccount(address _signerWallet, bool _done) public frozen returns (bool success) {
    _accountDetails[msg.sender].signerWallet = _signerWallet;
    if (_done) {
      warmUp();
    }
    return true;
  }

  function withdraw(address _asset, uint _amount) public frozen returns (bool success) {
    return transferFunds(msg.sender, msg.sender, _asset, _amount);
  }

  function depositToken(address _asset, uint _amount) public returns (bool success) {
    // todo safe match etc
    ERC20(_asset).transferFrom(msg.sender, address(this), _amount);
    _balances[msg.sender][_asset] = _balances[msg.sender][_asset] + _amount;
    return true;
  }

  function depositEther() public payable returns (bool success) {
    _balances[msg.sender][_etherAddress] = _balances[msg.sender][_etherAddress] + msg.value;
    return true;
  }

  function transferFunds(address _from, address payable _to, address _asset, uint _amount) private returns (bool success) {
    if (_amount == 0) {
      return false;
    }
    // TODO use safemath
    _balances[_from][_asset] = _balances[_from][_asset] - _amount;
    if (_asset == _etherAddress) {
      _to.transfer(_amount);
    } else {
      // TODO, ensure that we can actually do this - we dont want to revert and avoid punishing
      ERC20(_asset).transfer(_to, _amount);
    }
    return true;
  }

  function punishDishonest(
    address[5] memory _addressVals,
    uint[5] memory _uintVals
  ) private returns (bool wasPunished) {
    bool punish = false;
    uint maxSpend = getMaxSpend(_addressVals[0], _addressVals[2]);
    uint relayMaxSpend = getMaxSpend(_addressVals[0], _addressVals[4]);
    // // if the nonce is invalid (trying to double spend)
    if (_uintVals[0] != _accountDetails[_addressVals[0]].nonce + 1) {
      punish = true;
    }
    // trying to spend too much
    if (maxSpend < _uintVals[1]) {
      punish = true;
    }
    // trying to spend too much
    if (relayMaxSpend < _uintVals[3]) {
      punish = true;
    }
    // punish!
    if (punish) {
      // TODO insert a more clever punishemnent system
      transferFunds(_addressVals[0], _burnAddress, address(uint160(_addressVals[3])), relayMaxSpend);
      transferFunds(_addressVals[0], _burnAddress, _addressVals[2], getBalance(_addressVals[2],_addressVals[0]));
      transferFunds(_addressVals[0], _burnAddress, _addressVals[4], getBalance(_addressVals[4],_addressVals[0]));
    }
    return punish;
  }

  function validateSwap(
    address[5] memory _addressVals,
    uint[5] memory _uintVals,
    bytes32[2] memory _bytes32Vals,
    bytes32 _messageHash,
    bytes memory _signature
  ) private returns (bool success) {
    require(_completedSwaps[_messageHash] != true, 'swap is already claimed');
    require(_uintVals[2] > block.timestamp, 'swap os expired');
    require(getSignatureIsValid(_addressVals[0], _signature, _messageHash), 'invalid signature');
    if (punishDishonest(_addressVals, _uintVals)) {
      return false;
    }
    require(_uintVals[4] > block.timestamp || msg.sender == _addressVals[3], 'not priority relayer');
    require(sha256(abi.encodePacked(_bytes32Vals[1])) == _bytes32Vals[0], 'incorrect invoice');
    return true;
  }

  function completeSwap(
    address[5] memory _addressVals,
    uint[5] memory _uintVals,
    bytes32[2] memory _bytes32Vals,
    bytes32 _messageHash
  ) private returns (bool _success) {
    _accountDetails[_addressVals[0]].nonce = _uintVals[0];
    _revealedHashes[_bytes32Vals[0]] = _bytes32Vals[1];
    _completedSwaps[_messageHash] = true;
    transferFunds(_addressVals[0], address(uint160(_addressVals[1])), _addressVals[2], _uintVals[1]);
    transferFunds(_addressVals[0], address(uint160(_addressVals[3])), _addressVals[4], _uintVals[3]);
    return true;
  }

	function swap(
    address[5] memory _addressVals, // preimageHash, preImage
    uint[5] memory _uintVals, // nonce, amount, expirationBlock, relayerAmount, relayerExpirationBlock
    bytes32[2] memory _bytes32Vals, // preImageHash , preImage
    bytes memory _signature
  ) public returns (bool success) {
    bytes32 messageHash = getMessageHash(_addressVals, _uintVals, _bytes32Vals);
    if (!validateSwap(_addressVals, _uintVals, _bytes32Vals, messageHash, _signature)) {
      return false;
    }
    completeSwap(_addressVals, _uintVals, _bytes32Vals, messageHash);
    return true;
  }
}