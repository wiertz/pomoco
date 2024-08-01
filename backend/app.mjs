

import 'dotenv/config'

import fs from 'fs'
import express from 'express'
import https from 'https'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

import { PomocoSession } from './entities/PomocoSession.mjs'
import { PomocoTimer } from './entities/PomocoTimer.mjs'

import { handleSession } from './sockets/handleSession.mjs'
import { handleTimer } from './sockets/handleTimer.mjs'



// setup constants

const FRONTEND = process.env.FRONTEND
const PORT = process.env.PORT
const CORS_ORIGIN = process.env.CORS_ORIGIN
const SSL_KEY = process.env.SSL_KEY
const SSL_CERT = process.env.SSL_CERT
const SSL_CHAIN = process.env.SSL_CHAIN


let HTTPS_OPTIONS
if(SSL_KEY && SSL_CERT && SSL_CHAIN) {
  HTTPS_OPTIONS = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    ca: fs.readFileSync(process.env.SSL_CHAIN)
  }
}



// setup http server

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.static(FRONTEND))
// app.get('/', (req, res) => {
//   res.sendFile(path.join(ROOT, 'index.html'))
// })

let server
if(HTTPS_OPTIONS) {
  server = https.createServer(HTTPS_OPTIONS, app)
} else {
  server = http.createServer(app)
}


// setup socket.io server

let cors_settings

if(CORS_ORIGIN) {
  cors_settings = {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
} else {
  cors_settings = {}
}

const io = new Server(server, {
  connectionStateRecovery: {},
  cors: cors_settings
})


// create Pomoco session

const pomocoTimer = new PomocoTimer([
  { description: 'FOCUS', duration: 60 },
  { description: 'PAUSE', duration: 3 }
])
const pomocoSession = new PomocoSession(pomocoTimer)


io.on('connection', socket => {
  handleSession(io, socket, pomocoSession)
  handleTimer(io, socket, pomocoSession)
})


// start server

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})