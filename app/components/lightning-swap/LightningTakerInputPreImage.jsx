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
  // handleChange({ e: { target: { value:   }}})
  return (
    <>
      <QRCode data={invoice.invoice} />
      <Json>{invoice}</Json>
      <input onChange={handleChange} placeholder="Paste preImage" />
      <button onClick={() => handleChange({ target: { value: testInvoicePreImage } })}>Paste</button>
    </>
  )
}

export default LightningTakerInputPreImage
