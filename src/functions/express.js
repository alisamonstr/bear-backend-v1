const awsServerlessExpress = require('aws-serverless-express')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const jwt = require('jsonwebtoken')

const passport = require('passport')
const jwtStrategry = require('../utils/jwt')

passport.use(jwtStrategry)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('hello express server')
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if (email === process.env.EMAIL) {
    if (password === process.env.PASSWORD) { // the password compare would normally be done using bcrypt.
      const opts = {}
      opts.expiresIn = 120 // token expires in 2min
      const secret = process.env.SECRET // normally stored in process.env.secret
      const token = jwt.sign({ email }, secret, opts)
      return res.status(200)
        .json({
          message: 'Auth Passed',
          token,
        })
    }
  }
  return res.status(401)
    .json({ message: 'Auth Failed' })
})


app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => res.status(200)
  .send('YAY! this is a protected Route'))

const server = awsServerlessExpress.createServer(app)
export const handlerExpress = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
