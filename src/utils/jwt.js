const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET // normally store this in process.env.secret

module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  if (jwtPayload.email === process.env.EMAIL) {
    return done(null, true)
  }
  return done(null, false)
})
