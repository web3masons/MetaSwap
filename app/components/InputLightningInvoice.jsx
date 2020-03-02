import { decodeInvoice } from '../utils/lightning'
import Json from './Json'

const InputLightningInvoice = ({ onChange, value = {} }) => {
  function handleChange (e) {
    const invoiceDetails = decodeInvoice(e.target.value)
    if (invoiceDetails) {
      onChange(invoiceDetails)
    }
  }
  return (
    <>
      <textarea className="form-input input-lg" onChange={handleChange} placeholder="Paste a lightning invoice or type 'test'" />
      {value.invoice && <Json>{value}</Json>}
    </>
  )
}

export default InputLightningInvoice
