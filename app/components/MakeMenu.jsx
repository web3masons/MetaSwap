import Link from 'next/link'

const CreateMenu = () => {
  return (
    <>
      <ul>
        <li><Link href="/make/lightning"><a>Lightning</a></Link></li>
        <li><Link href="/make/evm"><a>EVM</a></Link></li>
      </ul>
      <hr/>
    </>
  )
}

export default CreateMenu
