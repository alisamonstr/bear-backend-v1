import awsServerlessExpress from 'aws-serverless-express'
import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import jwtStrategry from '../utils/jwt'
import { getBears, updateBears, deleteBear } from './bears'
import { sendEmail } from './send-email'

const app = express()

passport.use(jwtStrategry)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/send-email', async (req, res) => {
  const email = await sendEmail(req.body)
  res.send(email)
})

app.get('/', (req, res) => {
  res.send('hello express server')
})

app.get('/bears', async (req, res) => {
  const bears = await getBears()
  res.send(bears)
})

app.post('/bears', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const updateBear = req.body
  const result = await updateBears(updateBear)
  res.send(result)
})

app.delete('/bears', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const deleteBearKey = req.body
  const result = await deleteBear(deleteBearKey)
  res.send(result)
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if (email === process.env.EMAIL) {
    if (password === process.env.PASSWORD) { // the password compare would normally be done using bcrypt.
      const opts = {}
      opts.expiresIn = 60 * 60 * 4 // token expires in 4 hours
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
