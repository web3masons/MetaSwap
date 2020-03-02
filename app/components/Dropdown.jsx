import { useEffect } from 'react'

const Dropdown = ({ onChange, items, name }) => {
  const list = Object.values(items)
  const defaultValue = list[0].key
  useEffect(() => {
    onChange({ target: { name, value: items[defaultValue] } })
  }, [])
  return (
    <select
      className="form-select select-lg"
      name={name}
      onChange={e => onChange({ target: { name, value: items[e.target.value] } })}
      defaultValue={defaultValue}
    >
      {Object.values(items).map(c => (
        <option key={c.name} value={c.key}>
          {c.name}
        </option>
      ))}
    </select>
  )
}

export default Dropdown
