import { chains } from '../utils/config'
import { useEffect } from 'react'

const SelectChain = ({ autoSelect, onChange }) => {
  const items = Object.values(chains)
  const autoSelected = autoSelect && items[0].key
  useEffect(() => {
    if (autoSelected) {
      onChange(chains[autoSelected])
    }
  }, [autoSelected])
  return (
    <select
      onChange={e => onChange(chains[e.target.value])}
      defaultValue={autoSelected}
    >
      <option value="" disabled hidden>
        Select Chain:
      </option>
      {items.map(c => (
        <option key={c.key} value={c.key}>
          {c.name}
        </option>
      ))}
    </select>
  )
}

export default SelectChain
