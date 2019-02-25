'use strict'

const express = require('express')
const next = require('next')
const routes = require('./routes')
const dotenv = require('dotenv')
const compression = require('compression')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const https = require('https')
const request = require('request');

process.on('uncaughtException', function(err) {
    console.error('Uncaught Exception: ', err)
})

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.PORT = process.env.PORT || 3000
process.env.HTTPS_SERVER = process.env.HTTPS_SERVER || 'false'

// const dev = process.env.NODE_ENV !== 'production'
const configFileMappings = {
    'development': './configs/.env.development',
    'production': './configs/.env.production'
}

dotenv.config({path: configFileMappings[process.env.NODE_ENV]})

const app = next({
    dir: '.',
    dev: process.env.NODE_ENV === 'development'
})
// const handle = routes.getRequestHandler(app)
const handler = routes.getRequestHandler(app, ({req, res, route, query}) => {
  app.render(req, res, route.page, query)
})

app.prepare()
.then(() => {
  const server = express()
  server.use(handler)
  server.use(cors())
  server.use(compression({ threshold: 0 }));
  server.use(cookieParser())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())

  server.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept, Authorization');
      next();
  });

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.log('An error occurred, unable to start the server')
  console.error(ex.stack)
  process.exit(1)
})
