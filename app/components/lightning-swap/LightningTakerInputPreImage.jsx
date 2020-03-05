import QRCode from '../QRCode'
import { testInvoicePreImage } from '../../utils'
import { validatePreImage } from '../../utils/lightning'

const LightningTakerInputPreImage = ({ onChange, invoice, value = {} }) => {
  function handleChange ({ target: { value } }) {
    const preImage = value === 'test' ? testInvoicePreImage : value
    const validPreImage = validatePreImage(invoice, preImage)
    if (validPreImage) {
      onChange(validPreImage)
    }
  }
  return (
    <div className="text-center">
      <h5>Pay this Lightning invoice to complete the swap!</h5>
      <span className="label label-rounded label-secondary">
        After payment, you must copy the preImage into the input box below!
      </span>
      <br />
      <a href={`lightning://${invoice.invoice}`}>
        <QRCode data={invoice.invoice} />
        Scan or click the QR code or to pay.
      </a>
      <br />
      <br />
      <input
        className="form-input input-lg text-center"
        onChange={handleChange}
        placeholder="Paste the payment pre image here or type 'test'"
      />
    </div>
  )
}

export default LightningTakerInputPreImage
