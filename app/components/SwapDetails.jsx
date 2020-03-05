import SwapSide from './SwapSize'

const SwapDetails = ({ makerSwap, takerSwap }) => {
  return (
    <div className="container text-center">
      <div className="columns">
        <div className="column col-5">
          <SwapSide swap={makerSwap} />
        </div>
        <div className="column col-2 swap-arrows">͍</div>
        <div className="column col-5">
          <SwapSide swap={takerSwap} />
        </div>
      </div>
    </div>
  )
}

export default SwapDetails
