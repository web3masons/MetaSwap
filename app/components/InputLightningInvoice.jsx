import { decodeInvoice } from '../utils/lightning'
import Json from './Json'

const InputLightningInvoice = ({ onChange, value = {} }) => {
  function handleChange (e) {
    const invoiceDetails = decodeInvoice()
    onChange(invoiceDetails)
  }
  return (
    <>
      <input onChange={handleChange} value={value.invoice} placeholder="Paste invoice" />
      {value.invoice && <Json>{value}</Json>}
    </>
  )
}

export default InputLightningInvoice
