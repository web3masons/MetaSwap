import { demoAccounts } from '../utils/demo-accounts'
import { useEffect } from 'react'

const SelectWallet = ({ onChange, autoSelect }) => {
  const items = Object.values(demoAccounts)
  const autoSelected = autoSelect && items[0].key
  useEffect(() => {
    if (autoSelected) {
      onChange(demoAccounts[autoSelected])
    }
  }, [autoSelected])
  return (
    <select
      onChange={e => onChange(demoAccounts[e.target.value])}
      defaultValue={autoSelected}
    >
      <option value="" disabled hidden>
        Select Demo Wallet:
      </option>
      {Object.values(demoAccounts).map(c => (
        <option key={c.name} value={c.key}>
          {c.name}
        </option>
      ))}
    </select>
  )
}

export default SelectWallet
