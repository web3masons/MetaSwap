import { useEffect } from 'react'

const DepositedAmount = ({ metaSwap, asset, account }) => {
  const assetAddress = asset && asset.address
  useEffect(() => {
    if (metaSwap.address && assetAddress) {
      metaSwap.getBalance(assetAddress, metaSwap.depositAccount)
    }
  }, [metaSwap.depositAccount, metaSwap.address, assetAddress])

  if (!assetAddress || !metaSwap) {
    return null
  }
  return metaSwap.balance(assetAddress, metaSwap.depositAccount)
}

export default DepositedAmount
