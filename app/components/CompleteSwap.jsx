import SwapDetails from './SwapDetails'

const CompleteSwap = ({ makerSwap, takerSwap }) => {
  return (
    <>
      <h2 className="text-primary text-center">👏👏 Swap is Complete! 👏👏</h2>
      <br />
      <SwapDetails {...{ makerSwap, takerSwap }} />
    </>
  )
}

export default CompleteSwap
