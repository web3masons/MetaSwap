import metaSwap from '../../contracts/build/contracts/MetaSwap'
import erc20Mock from '../../contracts/build/contracts/ERC20Mock'
import { nullAddress } from './misc'

export const chains = {
  ganache: {
    name: 'Ganache',
    url: 'http://localhost:8545',
    contractAddress: Object.values(metaSwap.networks).pop().address,
    tokenAddress: Object.values(erc20Mock.networks).pop().address
  },
  kovan: {
    name: 'Kovan',
    exporer: 'https://kovan.etherscan.io/tx/',
    url: 'https://kovan.infura.io/v3/7d0d81d0919f4f05b9ab6634be01ee73',
    contractAddress: metaSwap.networks['42'].address,
    tokenAddress: erc20Mock.networks['42'].address
  },
  rinkeby: {
    name: 'Rinkeby',
    exporer: 'https://rinkeby.etherscan.io/tx/',
    url: 'https://rinkeby.infura.io/v3/7d0d81d0919f4f05b9ab6634be01ee73',
    contractAddress: metaSwap.networks['4'].address,
    tokenAddress: erc20Mock.networks['4'].address
  }
  // etc: {
  //   name: 'Ethereum Classic',
  //   url: 'https://www.ethercluster.com/etc'
  // },
  // eth: {
  //   name: 'Ethereum',
  //   url: 'https://api.mycryptoapi.com/eth'
  // },
  // rsk: {
  //   name: 'Rootstock',
  //   url: 'https://public-node.rsk.co'
  // }
}

console.log(chains)

export const assets = {
  // eth: { chain: 'eth', name: 'ETH', address: nullAddress },
  // etc: { chain: 'etc', name: 'ETC', address: nullAddress },
  // rsk: { chain: 'rsk', name: 'RSK', address: nullAddress },
  ganache: {
    chain: 'ganache',
    name: 'Ganache ETH',
    address: nullAddress
  },
  ganacheToken: {
    chain: 'ganache',
    name: 'Ganache Token',
    address: chains.ganache.tokenAddress
  },
  kovan: {
    chain: 'kovan',
    name: 'Kovan ETH',
    address: nullAddress
  },
  kovanToken: {
    chain: 'kovan',
    name: 'Kovan Token',
    address: chains.kovan.tokenAddress
  },
  rinkeby: {
    chain: 'rinkeby',
    name: 'Rinkeby ETH',
    address: nullAddress
  },
  rinkebyToken: {
    chain: 'rinkeby',
    name: 'Rinkeby Token',
    address: chains.rinkeby.tokenAddress
  }
}

Object.keys(chains).forEach((k) => { chains[k].key = k })
Object.keys(assets).forEach((k) => { assets[k].key = k })
console.log(chains)
