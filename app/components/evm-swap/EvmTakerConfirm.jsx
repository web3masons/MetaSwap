import { testAddress } from '../../utils'

// TODO dry this out?

const EvmTakerConfirm = ({ onConfirm }) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onConfirm({ recipient: e.target.recipient.value })
    }}>
      Confirm Recipient Address:
      <input name='recipient' placeholder='Recipient Address' defaultValue={testAddress} />
      <button type="submit">Confirm</button>
    </form>
  )
}

export default EvmTakerConfirm
