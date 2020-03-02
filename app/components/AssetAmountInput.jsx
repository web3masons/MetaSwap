import { assets, chains } from '../utils/config'

import Dropdown from './Dropdown'

const AssetAmountInput = ({ name, onChange, onUpdateChain }) => {
  const amountName = name ? `${name}Amount` : 'amount'
  const assetName = name ? `${name}Asset` : 'asset'
  function handleChainChange (e) {
    onChange(e)
    onUpdateChain(chains[e.target.value.chain])
  }
  return (
    <>
      <input placeholder="Amount" onChange={onChange} name={amountName} />
      <Dropdown items={assets} onChange={handleChainChange} name={assetName} />
    </>
  )
}

export default AssetAmountInput
