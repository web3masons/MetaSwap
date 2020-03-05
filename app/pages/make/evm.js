import MakeMenu from '../../components/MakeMenu'
import MakeEvmSwap from '../../components/evm-swap/EvmMakerController'

const EvmMaker = () => (
  <>
    <MakeMenu active="evm" />
    <div className="swap-contents">
      <MakeEvmSwap />
    </div>
  </>
)

export default EvmMaker
