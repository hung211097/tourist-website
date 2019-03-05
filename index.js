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

const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

process.on('uncaughtException', function(err) {
    console.error('Uncaught Exception: ', err)
})

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})

passport.serializeUser(function(user, cb) {
    cb(null, user);
})

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
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

passport.use(
    new FacebookStrategy({
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: process.env.FB_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'birthday'],
        enableProof: true,
        graphApiVersion: 'v2.12'
    },
    function(accessToken, refreshToken, profile, cb) {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'userData': profile._json
            })
        }

        fetch(process.env.API_URL + 'misc/signin', options)
        .then(function(response) {
            if (response.status !== 200) {
                throw new Error('Bad response from server');
            }
            return response.json()
        })
        .then(function(data) {
            return cb(null, data)
        })
        .catch(function(error) {
            console.log('request failed', error)
            return cb(error, null)
        })
    }
))

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
  server.use(cors())
  server.use(compression({ threshold: 0 }));
  server.use(cookieParser())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())
  server.use(passport.initialize());
  server.use(passport.session());

  server.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept, Authorization');
      next();
  });

  server.get('/auth/facebook', (req, res, next) => {
      if (req.query.next && req.query.next !== '/login') {
          res.cookie('auth_callback_url', req.query.next, { expires: new Date(Date.now() + 900000) })
      }
      passport.authenticate('facebook', {
        scope: ['email']
      })(req, res, next)
  })

  server.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.cookie('user', JSON.stringify(req.user))
        if(Object.prototype.hasOwnProperty.call(req.cookies, 'auth_callback_url')){
            res.redirect(req.cookies.auth_callback_url)
        } else {
            res.redirect('/')
        }
    })

    server.use(handler)

    server.all('*', (req, res) => {
        // cookie.plugToRequest(req, res) // <---- this line
        if (req.path === '/robots.txt') {
            return res.sendFile('./static/robots.txt', { root: __dirname })
        }
        let nextRequestHandler = nextApp.getRequestHandler()
        return nextRequestHandler(req, res)
    })

    if (process.env.NODE_ENV === 'development' && process.env.HTTPS_SERVER !== 'false') {
        var certOptions = {
            key: fs.readFileSync(path.resolve('.localdev/key.pem')),
            cert: fs.readFileSync(path.resolve('.localdev/cert.pem'))
        }
        https.createServer(certOptions, server).listen(process.env.PORT, () => {
          console.log('> Ready on https://localhost:' + process.env.PORT)
        })
    } else {
        server.listen(process.env.PORT, err => {
            if (err) {
                throw err
            }
            console.log('> Ready on port ' + process.env.PORT + ' [' + process.env.NODE_ENV + ']')
        })
    }
  // server.listen(process.env.PORT, (err) => {
  //   if (err) throw err
  //   console.log('> Ready on http://localhost:' + process.env.PORT)
  // })
})
.catch((ex) => {
  console.log('An error occurred, unable to start the server')
  console.error(ex.stack)
  process.exit(1)
})
