import { assets, chains } from '../utils/config'

import Dropdown from './Dropdown'

const AssetAmountInput = ({ name, onChange, onUpdateChain, renderDeposited }) => {
  const amountName = name ? `${name}Amount` : 'amount'
  const assetName = name ? `${name}Asset` : 'asset'
  function handleChainChange (e) {
    onChange(e)
    onUpdateChain(chains[e.target.value.chain])
  }
  return (
    <div className="columns col-oneline">
      <div className="column col-6">
        <Dropdown items={assets} onChange={handleChainChange} name={assetName} />
      </div>
      <div className="column col-6">
        <input type="number" min="0" max="100" step="1" className="form-input input-lg" placeholder="Amount" onChange={onChange} name={amountName} />
        {renderDeposited}
      </div>
    </div>
  )
}

export default AssetAmountInput
