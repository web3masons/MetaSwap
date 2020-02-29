import { Wallet } from 'ethers'

// same as ganache startup in contracts/package.json and truffle-config.js
const mnemonic = 'vanish fire cage artwork upon heart endorse web initial rain gown wear'

// 0x0e22a0f27fd673d8b50e1f512f4cd085afdb0153
export const relayer = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/3")

// 0xb485e7b73f75b5725aebfb19cbca50b71112d85b
export const makerAdmin = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0")
// 0x5359dae448498aa7d998d50320fc8864c21f60df
export const takerAdmin = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/1")

// no balance accounts for signing only
export const makerSigner = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/1/0")
export const takerSigner = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/1/1")

export const demoAccounts = {
  makerAdmin: { name: 'Maker', key: 'makerAdmin', wallet: makerAdmin, signerWallet: makerSigner },
  takerAdmin: { name: 'Taker', key: 'takerAdmin', wallet: takerAdmin, signerWallet: takerSigner }
}
