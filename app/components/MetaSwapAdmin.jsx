// import { useContract, useWallet } from '../hooks'
// import SelectWallet from './SelectWallet'
// import { useEffect } from 'react'

const MetaSwapAdmin = (props) => {
  // const [state, actions] = useContract(props)
  // const [wallet, setWallet] = useWallet()
  // console.log('hi state!')
  // useEffect(() => getThing())
  // useEffect(() => {
  //   console.log('just once')
  //   actions.depositEther(5)
  // }, [actions])
  return (
    <>
      {/* <SelectWallet onChange={setWallet} /> */}
      {/* <pre>{JSON.stringify(wallet)}</pre> */}
    </>
  )
  return (
    <pre onClick={() => actions.depositEther(20)}>
      {JSON.stringify(state, null, 2)}
    </pre>
  )
}

export default MetaSwapAdmin
