var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var request = require('request')
var cors = require('cors')
var qs = require('querystring')
var config = require('./config.json')
var OAuth = require('oauth')
var timestamp = require('unix-timestamp')
var oauthSignature = require('oauth-signature')
var fantasySports = require('yahoo-fantasy-without-auth')


var yf = new fantasySports()
var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: true}))
app.set('port', process.env.PORT || config.port)
// app.use(allowCrossDomain);
var clientId = config.auth.yahoo.clientId
var clientSecret = config.auth.yahoo.clientSecret
var redirectUri = 'https://keepersync.com/auth/yahoo/callback'

app.get('/', function (req, res) {
  res.send('keeperSync authentication server')
})

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


app.get('/auth/yahoo', function(req, res) {
  var authorizationUrl = 'https://api.login.yahoo.com/oauth2/request_auth';

  var queryParams = qs.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code'
  });

  res.redirect(authorizationUrl + '?' + queryParams);
});


// GET /auth/yahoo/callback

app.get('/auth/yahoo/callback', function(req, res) {
  var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';

  var options = {
    url: accessTokenUrl,
    headers: { Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64') },
    rejectUnauthorized: false,
    json: true,
    form: {
      code: req.query.code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }
  };

  // 1. Exchange authorization code for access token.
  request.post(options, function(err, response, body) {
    var guid = body.xoauth_yahoo_guid;
    var accessToken = body.access_token;
    var refreshToken = body.refresh_token;
    var socialApiUrl = 'https://social.yahooapis.com/v1/user/' + guid + '/profile?format=json';

    var options = {
      url: socialApiUrl,
      headers: { Authorization: 'Bearer ' + accessToken },
      rejectUnauthorized: false,
      json: true
    };

    // 2. Retrieve profile information about the current user.
    request.get(options, function(err, response, body) {

    // 3. Create a new user account or return an existing one

      var userParams = qs.stringify({
        guid: guid,
        //email: body.profile.emails[0].handle,
        profileImage: body.profile.image.imageUrl,
        firstName: body.profile.givenName,
        lastName: body.profile.familyName,
        displayName: body.profile.nickname,
        accessToken: accessToken,
        refreshToken: refreshToken
      })
      res.redirect('http://mylocalwebsite.net/#/callback/?' + userParams);

    })
  })
})

app.get('/teams', function(req, res) {
  var accessToken = req.query.accessToken
  var game_key = 'nfl'

  yf.setUserToken(accessToken)

  yf.user.game_teams(
    game_key,
    function(err, data) {
      if (err) {
        console.log('Oops: ', err)
        return res.json({error: 401})
      }
      else {
        teamData = data
        return res.json(teamData)
      }
    }
  )
})

app.get('/leagues', function(req, res) {
  var accessToken = req.query.accessToken
  var game_key = 'nfl'

  yf.setUserToken(accessToken)

  yf.user.game_leagues(
    game_key,
    function(err, data) {
      if (err) {
        console.log('Oops: ', err)
        return res.json({error: 401})
      }
      else {
        leagueData = data
        return res.json(leagueData)
      }
    }
  )
})

app.get('/rosters', function(req, res) {
  var accessToken = req.query.accessToken
  var team_key = req.query.team_key

  yf.setUserToken(accessToken)

  yf.team.roster(
    team_key,
    function(err, data) {
      if (err) {
        console.log('Oops: ', err)
        return res.json({error: 401})
      }
      else {
        rosterData = data
        return res.json(rosterData)
      }
    }
  )
})

app.get('/standings', function(req, res) {
  var accessToken = req.query.accessToken
  var refreshToken = req.query.refreshToken
  var league_key = req.query.league_key

  yf.setUserToken(accessToken)

  yf.league.standings(
    league_key,
    function(err, data) {
      if (err) {
        console.log('Oops: ', err)
        return res.json({error: 401})
      }
      else {
        standingsData = data
        return res.json(standingsData)
      }
    }
  )
})

app.get('/auth/yahoo/refresh', function(req, res) {
  console.log('Attempting to refresh token...')

  var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token'
  var options = {
    url: accessTokenUrl,
    headers: { Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64') },
    rejectUnauthorized: false,
    json: true,
    form: {
      refresh_token: req.query.refreshToken,
      redirect_uri: redirectUri,
      grant_type: 'refresh_token'
    }
  }

  // 1. Exchange authorization code for access token.
  request.post(options, function(err, response, body) {
    var guid = body.xoauth_yahoo_guid;
    var accessToken = body.access_token;
    var refreshToken = body.refresh_token;
    var socialApiUrl = 'https://social.yahooapis.com/v1/user/' + guid + '/profile?format=json';

    var options = {
      url: socialApiUrl,
      headers: { Authorization: 'Bearer ' + accessToken },
      rejectUnauthorized: false,
      json: true
    }

    // 2. Retrieve profile information about the current user.
    request.get(options, function(err, response, body) {

    // 3. Create a new user account or return an existing one

      var userParams = qs.stringify({
        guid: guid,
        //email: body.profile.emails[0].handle,
        profileImage: body.profile.image.imageUrl,
        firstName: body.profile.givenName,
        lastName: body.profile.familyName,
        displayName: body.profile.nickname,
        accessToken: accessToken,
        refreshToken: refreshToken
      })
      res.json(userParams)

    })
  })
})

//////////////////////////////////////////////////////////////////
//
// MFL
//
//////////////////////////////////////////////////////////////////

app.get('/auth/mfl', function(req, res) {
  var baseUrl = 'https://api.myfantasyleague.com/'
  var year = 2017
  var username = req.query.USERNAME
  var password = req.query.PASSWORD

  var queryParams = qs.stringify({
    USERNAME: username,
    PASSWORD: password,
    XML: 1
  })
  var fullUrl = baseUrl + year + '/login?' + queryParams
  var options = {
    url: fullUrl
  }
  // 1. Retrieve cookie.
  request.get(options, function(err, response, body) {
    console.log(response.data)
    var cookie = response.data.match(/"(\w+)"/)[1]
    
    var options = {
      url: 'https://api.myfantasyleague.com/2017/export',
      headers: { Cookie: 'MFL_USER_ID=' + cookie },
      qs: {
        TYPE: 'myleagues',
        JSON: 0
      }
    }
    return res.json(response)
  })


})
