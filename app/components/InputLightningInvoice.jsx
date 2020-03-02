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
      <input onChange={handleChange} placeholder="Paste invoice" />
      {value.invoice && <Json>{value}</Json>}
    </>
  )
}

export default InputLightningInvoice
