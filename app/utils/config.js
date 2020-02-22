import metaSwap from '../../contracts/build/contracts/MetaSwap'
import erc20Mock from '../../contracts/build/contracts/ERC20Mock'
const { address: contractAddress } = Object.values(metaSwap.networks).pop()
const { address: tokenAddress } = Object.values(erc20Mock.networks).pop()

export const chains = {
  test: {
    key: 'test',
    name: 'Ganache',
    url: 'http://localhost:8545',
    contractAddress,
    tokenAddress
  },
  etc: {
    key: 'etc',
    name: 'Ethereum Classic',
    url: 'https://www.ethercluster.com/etc'
  },
  eth: {
    key: 'eth',
    name: 'Ethereum',
    url: 'https://api.mycryptoapi.com/eth'
  },
  rsk: {
    key: 'rsk',
    name: 'Rootstock',
    url: 'https://public-node.rsk.co'
  }
}
