var express = require('express')
var bodyParser = require('body-parser')
var Axios = require('axios')
var Request = require('request')
var cors = require('cors')
var config = require('./config.json')
var OAuth = require('oauth')
var timestamp = require('unix-timestamp')
var oauthSignature = require('oauth-signature')
var passport = require('passport')
var yahooStrategy = require('passport-yahoo-oauth2').Strategy

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.set('port', process.env.PORT || config.port)
// app.use(allowCrossDomain);

app.get('/', function (req, res) {
  res.send('keeperSync authentication server')
})

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

passport.use(new yahooStrategy({
    consumerKey: config.auth.yahoo.clientId,
    consumerSecret: config.auth.yahoo.clientSecret,
    callbackURL: '/auth/yahoo/callback',
}, function (token, tokenSecret, profile, done) {
  User.findOrCreate({ yahooId: profile.id }, function (err, user) {
    return done(err, user)
  })
}))

app.post('/auth/yahoo', passport.authenticate('yahoo'))
app.get('/auth/yahoo/callback',
    passport.authenticate('yahoo'),
    function (req, res) {
        res.end(popupTools.popupResponse(req.user))
    }
)
