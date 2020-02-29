import { useMyReducer } from '../hooks'
import { useEffect, useRef } from 'react'
import { encryptMessage, decryptMessage } from '../utils/crypto'
import { isClient, randomId } from '../utils'
import { utils } from 'ethers'

const { Peer } = isClient && require('peerjs').peerjs

const peerConfig = { debug: 0, host: 'localhost', port: 3000, path: '/rtc' }

// TODO we might want to use a different way to discover, e.g. qr codes...

export default function ({ signer, host, channelId, autoConnect }) {
  const [state, { merge, set }] = useMyReducer()

  const peer = useRef(null)
  const conn = useRef(null)
  const sharedSecret = useRef(null)
  const q = useRef([])

  const handlers = useRef({
    onData: () => {},
    onConnect: () => {}
  })

  useEffect(() => {
    if (autoConnect) {
      connect()
    }
    return () => {
      peer.current && peer.current.destroy()
    }
  }, [autoConnect, host, channelId])

  function connect () {
    if (host) {
      createChannel()
    } else if (channelId) {
      connectToChannel()
    }
  }
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
    conn.current.on('open', (info) => {
      const { peer } = conn.current
      merge({ peerId: peer, connected: true })
      setTimeout(() => {
        conn.current.send({ pubKey: signer.signingKey.publicKey })
      }, 1000)
      conn.current.on('data', data => {
        if (data.pubKey) {
          createSharedSecret(data.pubKey)
        } else if (sharedSecret.current) {
          handleReceiveMessage(decrypt(data))
        } else {
          q.current.push(data)
        }
      })
    })
  }
  function createSharedSecret (peerPubKey) {
    // TODO check that the address matches something on chain?
    const peerAddress = utils.computeAddress(peerPubKey)
    sharedSecret.current = signer.signingKey.computeSharedSecret(peerPubKey)
    merge({ peerPubKey, peerAddress })
    q.current.forEach(data => handleReceiveMessage(decrypt(data)))
    q.current = []
    sendMessage({ ready: true })
  }
  function handleReceiveMessage (msg) {
    if (msg.ready) {
      merge({ ready: true })
      handlers.current.onConnect()
    } else {
      handlers.current.onData(msg)
      if (msg.type && handlers.current[msg.type]) {
        handlers.current[msg.type](msg.payload)
      }
    }
    merge({ peerLastSeen: msg._timestamp })
  }

  function encrypt (msg) {
    return encryptMessage(msg, sharedSecret.current)
  }
  function decrypt (msg) {
    return decryptMessage(msg, sharedSecret.current)
  }
  function logMessage (msg) {
    const iam = !host ? '🙍‍♀️' : '🙎‍♂️'
    const { payload, type } = msg
    if (type) {
      console.log(iam, type, payload)
    } else {
      console.log(iam, msg)
    }
  }
  function sendMessage (msg) {
    logMessage(msg)
    conn.current.send(encrypt({ ...msg, _timestamp: new Date().getTime() }))
  }

  const actions = {
    connect,
    send: (type, payload) => sendMessage({ type, payload }),
    onConnect (fn) {
      handlers.current.onConnect = fn
    },
    onData (fn) {
      handlers.current.onData = fn
    },
    onMessage (key, fn) {
      handlers.current[key] = fn
    }
  }

  return { ...state, ...actions }
}
