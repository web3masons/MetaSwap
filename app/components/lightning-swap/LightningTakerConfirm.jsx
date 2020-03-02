import { testAddress } from '../../utils'

const LightningTakerConfirm = ({ onConfirm }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onConfirm({ recipient: e.target.recipient.value })
      }}
    >
      Confirm Recipient Address:
      <input
        name="recipient"
        placeholder="Recipient Address"
        defaultValue={testAddress}
      />
      <button className="btn btn-primary" type="submit">Confirm</button>
    </form>
  )
}

export default LightningTakerConfirm
