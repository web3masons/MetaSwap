import { testAddress } from '../../utils'
import SwapOffer from '../SwapOffer'

const LightningTakerConfirm = ({ swap }) => {
  return (
    <form
      className="form-group"
      onSubmit={e => {
        e.preventDefault()
        swap.confirmRecipient({ recipient: e.target.recipient.value })
      }}
    >
      <SwapOffer makerSwap={swap} takerSwap={swap.invoice} />
      <br/>
      <h4 className="text-center">Looks Good?</h4>
      <label className="form-label label-lg text-center">Confirm Recipient Address:</label>
      <input
        className="form-input input-lg"
        name="recipient"
        placeholder="Recipient Address"
        defaultValue={testAddress}
      />
      <button className="btn btn-primary btn-full" type="submit">
        Confirm
      </button>
    </form>
  )
}

export default LightningTakerConfirm
