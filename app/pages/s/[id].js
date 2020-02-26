import { useRouter } from 'next/router'
import TakeSwap from '../../components/TakeSwap'

const Swap = () => {
  const router = useRouter()
  const { id } = router.query
  return <TakeSwap channelId={id} />
}

export default Swap
