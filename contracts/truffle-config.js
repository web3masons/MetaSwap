const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "vanish fire cage artwork upon heart endorse web initial rain gown wear";

module.exports = {
  mnemonic,
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, 'https://kovan.infura.io/v3/7d0d81d0919f4f05b9ab6634be01ee73'),
      network_id: 42,
      networkCheckTimeout: 1000000000,
      skipDryRun: true
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/7d0d81d0919f4f05b9ab6634be01ee73'),
      network_id: 4,
      networkCheckTimeout: 1000000000,
      skipDryRun: true
    }
  },
}