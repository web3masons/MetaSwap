import { sampleSwap } from '../utils'
import Json from './Json'
import SwapSide from './SwapSize'

const CompleteSwap = ({ makerSwap, takerSwap }) => {
  // const swap = sampleSwap
  return (
    <>
      <div className="text-center">
        <h2 className="text-primary">👏👏 Swap is Complete! 👏👏</h2>
        <br/>
        <div className="container">
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
      </div>
      {/* <Json>{swap}</Json> */}
    </>
  )
}

export default CompleteSwap
