import SwapSide from './SwapSize'

const SwapOffer = ({ makerSwap, takerSwap }) => {
  return (
    <div className="container text-center">
      <div className="columns">
        <div className="column col-5">
          <h6>You will Sell</h6>
          <SwapSide swap={takerSwap} />
        </div>
        <div className="column col-2 swap-arrows text-primary">͍</div>
        <div className="column col-5">
          <h6>You will Buy</h6>
          <SwapSide swap={makerSwap} />
        </div>
      </div>
    </div>
  )
}

export default SwapOffer
