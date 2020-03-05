import MakeMenu from '../../components/MakeMenu'
import MakeLightningSwap from '../../components/lightning-swap/LightningMakerController'

const LightningMaker = () => (
  <>
    <MakeMenu active="lightning" />
    <div className="swap-contents">
      <MakeLightningSwap />
    </div>
  </>
)

export default LightningMaker
