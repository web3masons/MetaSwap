const SelectWallet = ({ onChange }) => {
  return (
    <input placeholder="Paste Private Key" onChange={e => {
      onChange(e.target.value)
    }} />
  )
}

export default SelectWallet
