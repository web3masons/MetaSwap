import { useEffect } from 'react'

const DepositedAmount = ({ metaSwap, asset }) => {
  const assetAddress = asset && asset.address
  useEffect(() => {
    if (metaSwap.address && assetAddress) {
      metaSwap.getBalance(assetAddress, metaSwap.depositAccount)
    }
  }, [metaSwap.depositAccount, metaSwap.address, assetAddress])

  if (!assetAddress || !metaSwap) {
    return null
  }
  return (
    <span className="label label-secondary my-2">
      Deposited: {metaSwap.balance(assetAddress, metaSwap.depositAccount)}
    </span>

  )
}

export default DepositedAmount
