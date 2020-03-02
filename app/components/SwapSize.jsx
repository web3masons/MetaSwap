import React from 'react'
import Json from './Json'
import { assets } from '../utils'

const SwapSide = ({ swap }) => {
  if (swap.coinType) {
    return (
      <>
        <h4 className="text-primary">⚡️ Bitcoin</h4>
        <h5>
          {swap.milisats / 1000} sats
          <br />
          <small>Lightning Invoice Paid</small>
        </h5>
      </>
    )
  }
  return (
    <>
      <h4 className="text-primary">{swap.asset.name}</h4>
      <h5>
        {swap.amount} unit(s)
        <br />
        <small>
          <a href={`${swap.provider.explorer}/${swap.txHash}`} target="_blank">Transaction Published</a>
        </small>
      </h5>
    </>
  )
}

export default SwapSide
