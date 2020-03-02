import Json from '../Json'
import QRCode from '../QRCode'
import { testInvoicePreImage } from '../../utils'
import { validatePreImage } from '../../utils/lightning'

const LightningTakerInputPreImage = ({ onChange, invoice, value = {} }) => {
  function handleChange (e) {
    const preImage = e.target.value
    const validPreImage = validatePreImage(invoice, preImage)
    if (validPreImage) {
      onChange(validPreImage)
    }
  }
  return (
    <>
      <QRCode data={invoice.invoice} />
      <Json>{invoice}</Json>
      <input onChange={handleChange} placeholder="Paste preImage" />
      <button className="btn btn-primary" onClick={() => handleChange({ target: { value: testInvoicePreImage } })}>Paste</button>
    </>
  )
}

export default LightningTakerInputPreImage
