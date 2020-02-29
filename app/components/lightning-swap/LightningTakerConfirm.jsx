import { testAddress } from '../../utils'

const LightningTakerConfirm = ({ onConfirm }) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onConfirm({ recipient: e.target.recipient.value })
    }}>
      Confirm Recipient Address:
      <input name='recipient' placeholder='Recipient Address' value={testAddress} />
      <button type="submit">Confirm</button>
    </form>
  )
}

export default LightningTakerConfirm
