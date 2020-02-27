import useLightningSwap from '../../../../hooks/lightningSwap'

import Initialize from './Initialize'
import SetInvoice from './SetInvoice'
import Share from './Share'
import ConfirmCreation from './ConfirmCreation'
import { bob } from '../../../../utils'

// actions are...
// M initializeSwap()
// M setInvoice()
// M confirmCreation()
// T confirmTakerAddress() (!!!pre-populate)
// M _sendSignedSwap()
// M/T publishPreImage()

const LightningSwapTakeController = () => {
  const swap = useLightningSwap({ signer: bob })
  // Select amount
  // Paste invoice
  // show qr + open peer connection
  return (
    <>
      <pre>{JSON.stringify(swap, null, 2)}</pre>
      {(() => {
        if (!swap.asset) {
          return <Initialize onInitialize={swap.initializeSwap} />
        }
        if (!swap.invoice) {
          return <SetInvoice onSetInvoice={swap.setInvoice} />
        }
        if (!swap.ready) {
          return <ConfirmCreation onConfirm={swap.confirmCreation} />
        }
        if (!swap.peer.ready) {
          return <Share peerId={swap.peer.id} />
        }
        if (!swap.signedSwap) {
          return '...'
        }
      })()}
    </>
  )
}

export default LightningSwapTakeController
