import { chains } from '../utils/config'

const SelectChain = ({ selected, onChange }) => {
  return (
    <select onChange={(e) => onChange(chains[e.target.value])} defaultValue="" selected={selected}>
      <option value="" disabled hidden>
        Select Chain:
      </option>
      {Object.values(chains).map(c => (
        <option key={c.key} value={c.key}>
          {c.name}
        </option>
      ))}
    </select>
  )
}

export default SelectChain
