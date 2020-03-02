import { assets, chains } from '../utils/config'

import Dropdown from './Dropdown'

const AssetAmountInput = ({ state, onChange, onUpdateChain }) => {
  function handleChange (e) {
    onChange(e)
    onUpdateChain(chains[e.target.value.chain])
  }
  return (
    <>
      <input
        placeholder="Amount"
        name="amount"
        onChange={onChange}
      />
      <Dropdown items={assets} onChange={handleChange} name="asset" />
    </>
  )
}

export default AssetAmountInput
