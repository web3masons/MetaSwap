import { assets, chains } from '../utils/config'

console.log('yo ', assets, chains)

const AssetAmountInput = ({ state, onChange, onUpdateChain }) => {
  // should update the provider if it changes
  const items = Object.values(assets)

  function handleChange (e) {
    const asset = assets[e.target.value]
    onChange({ target: { name: 'asset', value: asset.address } })
    onUpdateChain(chains[asset.chain])
  }

  return (
    <>
      <input value={state.amount} placeholder="Amount" onChange={onChange} />
      <select onChange={handleChange}>
        <option>Select Asset:</option>
        {Object.values(items).map(c => (
          <option key={c.name} value={c.key}>
            {c.name}
          </option>
        ))}
      </select>
    </>
  )
}

export default AssetAmountInput
