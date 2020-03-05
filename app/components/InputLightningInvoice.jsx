import { decodeInvoice } from '../utils/lightning'

const InputLightningInvoice = ({ onChange, value = {} }) => {
  function handleChange (e) {
    const invoiceDetails = decodeInvoice(e.target.value)
    if (invoiceDetails) {
      onChange(invoiceDetails)
    }
  }
  return (
    <textarea className="form-input input-lg" onChange={handleChange} placeholder="Paste a lightning invoice or type 'test'" />
  )
}

export default InputLightningInvoice
