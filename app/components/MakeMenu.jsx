import Link from 'next/link'

const CreateMenu = () => {
  return (
    <>
      What would you like to buy today?
      <ul>
        <li><Link href="/make/lightning"><a>Lightning Network Bitcoin</a></Link></li>
        <li><Link href="/make/evm"><a>EVM Assets (Ether, Tokens, etc.)</a></Link></li>
      </ul>
      <hr/>
    </>
  )
}

export default CreateMenu
