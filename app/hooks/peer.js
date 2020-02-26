import { useMyReducer } from '../hooks'
import { useEffect, useRef } from 'react'
import { encryptMessage, decryptMessage } from '../utils/crypto'
import { isClient, randomId } from '../utils'
import { utils } from 'ethers'

const { Peer } = isClient && require('peerjs').peerjs

const peerConfig = { debug: 0, host: 'localhost', port: 3000, path: '/rtc' }

export default function ({ signer, host, channelId }) {
  // with state or reducer
  const [state, { merge, set }] = useMyReducer()

  const peer = useRef(null)
  const conn = useRef(null)
  const sharedSecret = useRef(null)

  useEffect(() => {
    if (host) {
      createChannel()
    } else if (channelId) {
      connectToChannel()
    }
    return () => {
      peer.current && peer.current.destroy()
    }
  }, [host, channelId])

  function createChannel () {
    const generatedId = randomId()
    peer.current = new Peer(generatedId, peerConfig)
    peer.current.on('error', console.error)
    peer.current.on('open', id => set({ id, host, channelId: generatedId, open: true }))
    peer.current.on('connection', (conn) => handleConnection(conn))
  }
  function connectToChannel () {
    peer.current = new Peer(randomId(), peerConfig)
    peer.current.on('error', console.error)
    peer.current.on('open', id => {
      set({ id, channelId, host, open: true })
      const conn = peer.current.connect(channelId, { reliable: true })
      handleConnection(conn)
    })
  }
  function handleConnection (connection) {
    if (conn.current) {
      // TODO handle refreshes
      console.log('Someone else tried to connect!')
      return
    }
    conn.current = connection
    conn.current.on('error', console.error)
    conn.current.on('open', info => {
      const { peer } = conn.current
      merge({ peerId: peer, connected: true })
      conn.current.send({ pubKey: signer.signingKey.publicKey })
      conn.current.on('data', data => {
        if (data.pubKey) {
          createSharedSecret(data.pubKey)
        } else {
          handleReceiveMessage(decrypt(data))
        }
      })
    })
  }
  function createSharedSecret (peerPubKey) {
    // TODO check that the address matches something on chain?
    const peerAddress = utils.computeAddress(peerPubKey)
    sharedSecret.current = signer.signingKey.computeSharedSecret(peerPubKey)
    merge({ peerPubKey, peerAddress })
    // TODO sign some other data to verify (e.g. block hash)
    sendMessage({ ready: true })
  }
  function handleReceiveMessage (msg) {
    if (msg.ready) {
      merge({ ready: true })
    }
    merge({ peerLastSeen: msg._timestamp })
  }

  function encrypt (msg) {
    return encryptMessage(msg, sharedSecret.current)
  }
  function decrypt (msg) {
    return decryptMessage(msg, sharedSecret.current)
  }
  function sendMessage (msg) {
    conn.current.send(encrypt({ ...msg, _timestamp: new Date().getTime() }))
  }

  return { ...state }
}
