// server.js
const next = require('next')
const routes = require('next-routes')()
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handler = routes.getRequestHandler(app)

// With express
const express = require('express')
// With Express Peer Server
const ExpressPeerServer = require('peer').ExpressPeerServer

app.prepare().then(() => {
  var expressApp = express()
  var server = require('http').createServer(expressApp)

  // Signalling server
  var expressPeerServer = ExpressPeerServer(server)
  // TODO only allow one connection
  expressApp.use('/rtc', expressPeerServer)

  expressApp.use(handler)
  server.listen(3000)
  console.log('Listening on port 3000!')
})
