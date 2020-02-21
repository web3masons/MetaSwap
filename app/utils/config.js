import artifacts from '../../contracts/build/contracts/MetaSwap'
const { address } = Object.values(artifacts.networks).pop()

export const chains = {
  test: {
    key: 'test',
    name: 'Ganache',
    url: 'http://localhost:8545',
    address
  },
  etc: {
    key: 'etc',
    name: 'Ethereum Classic',
    url: 'https://www.ethercluster.com/etc'
  },
  eth: {
    key: 'eth',
    name: 'Ethereum',
    url: 'https://mainnet.infura.io'
  },
  rsk: {
    key: 'rsk',
    name: 'Rootstock',
    url: 'https://public-node.rsk.co'
  }
}
