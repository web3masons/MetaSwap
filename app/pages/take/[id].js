import { useRouter } from 'next/router'
import TakeSwap from '../../components/TakeSwap'

const Swap = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <div className="swap-contents">
      <TakeSwap channelId={id} />
    </div>
  )
}

export default Swap
