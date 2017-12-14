var express = require('express')
var bodyParser = require('body-parser')
var Axios = require('axios')
var Request = require('request')
var cors = require('cors')
var config = require('./config.json')
var OAuth = require('oauth')
var timestamp = require('unix-timestamp')
var oauthSignature = require('oauth-signature')

var app = express()
app.use(cors())
app.use(bodyParser.json())
// app.use(allowCrossDomain);

app.get('/', function (req, res) {
  res.send('vue-authenticate')
})

app.post('/auth/:provider', function(req, res){
  switch(req.params.provider) {
    case 'facebook':
      facebookAuth(req, res)
      break
    case 'google':
      googleAuth(req, res)
      break
    case 'twitter':
      twitterAuth(req, res)
      break
    case 'instagram':
      instagramAuth(req, res)
      break
    case 'bitbucket':
      bitbucketAuth(req, res)
      break
    case 'linkedin':
      linkedinAuth(req, res)
      break
    case 'live':
      liveAuth(req, res)
      break
    case 'yahoo':
      yahooAuth(req, res)
      break
    case 'login':
      loginAuth(req, res)
      break
    case 'register':
      registerAuth(req, res)
      break
  }
});

app.listen(4000);

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

function loginAuth(req, res) {
  res.json({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@domain.com',
    created_at: new Date(),
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiBMb2dpbiBEb2UiLCJhZG1pbiI6dHJ1ZX0.VHK2sCbj5nKJ8oC44UTHuhQHXEdPN8zjKjaFT0OZ-LY'
  })
}

function registerAuth(req, res) {
  res.json({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@domain.com',
    created_at: new Date(),
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIFJlZ2lzdGVyIERvZSIsImFkbWluIjp0cnVlfQ.zTR57xocFkGp2UdFwBLk1cZUeqgSujvTqVAFagBlU4I'
  })
}

function facebookAuth(req, res) {
  Axios.post('https://graph.facebook.com/v2.4/oauth/access_token', {
    client_id: config.auth.facebook.clientId,
    client_secret: config.auth.facebook.clientSecret,
    code: req.body.code,
    redirect_uri: req.body.redirectUri
  }, { 'Content-Type': 'application/json' }).then(function (response) {
    var responseJson = response.data
    res.json(responseJson)
  }).catch(function (err) {
    res.status(500).json(err)
  })
}

function googleAuth(req, res) {
  Request({
    method: 'post',
    url: 'https://accounts.google.com/o/oauth2/token',
    form: {
      code: req.body.code,
      client_id: config.auth.google.clientId,
      client_secret: config.auth.google.clientSecret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }, function (err, response, body) {
    try {
      if (!err && response.statusCode === 200) {
        var responseJson = JSON.parse(body)
        res.json(responseJson)
      } else {
        res.status(response.statusCode).json(err)
      }
    } catch (e) {
      res.status(500).json(err || e)
    }
  })
}

function instagramAuth(req, res) {
  Request({
    method: 'post',
    url: 'https://api.instagram.com/oauth/access_token',
    form: {
      code: req.body.code,
      client_id: config.auth.instagram.clientId,
      client_secret: config.auth.instagram.clientSecret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }, function (err, response, body) {
    try {
      if (!err && response.statusCode === 200) {
        var responseJson = JSON.parse(body)
        res.json(responseJson)
      } else {
        res.status(response.statusCode).json(err)
      }
    } catch (e) {
      res.status(500).json(err || e)
    }
  })
}

function bitbucketAuth(req, res) {
  Request({
    method: 'post',
    url: 'https://bitbucket.org/site/oauth2/access_token',
    form: {
      code: req.body.code,
      client_id: config.auth.bitbucket.clientId,
      client_secret: config.auth.bitbucket.clientSecret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }, function (err, response, body) {
    try {
      if (!err && response.statusCode === 200) {
        var responseJson = JSON.parse(body)
        res.json(responseJson)
      } else {
        res.status(response.statusCode).json(err)
      }
    } catch (e) {
      res.status(500).json(err || e)
    }
  })
}

function linkedinAuth(req, res) {
  Request({
    method: 'post',
    url: 'https://www.linkedin.com/oauth/v2/accessToken',
    form: {
      code: req.body.code,
      client_id: config.auth.linkedin.clientId,
      client_secret: config.auth.linkedin.clientSecret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }, function (err, response, body) {
    try {
      if (!err && response.statusCode === 200) {
        var responseJson = JSON.parse(body)
        res.json(responseJson)
      } else {
        res.status(response.statusCode).json(err)
      }
    } catch (e) {
      res.status(500).json(err || e)
    }
  })
}

function liveAuth(req, res) {
  Request({
    method: 'post',
    url: 'https://login.live.com/oauth20_token.srf',
    form: {
      code: req.body.code,
      client_id: config.auth.live.clientId,
      client_secret: config.auth.live.clientSecret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/json'
    }
  }, function (err, response, body) {
    try {
      if (!err && response.statusCode === 200) {
        var responseJson = JSON.parse(body)
        res.json(responseJson)
      } else {
        res.status(response.statusCode).json(err)
      }
    } catch (e) {
      res.status(500).json(err || e)
    }
  })
}

function yahooAuth(req, res) {
    Request({
      method: 'post',
      url: 'https://api.login.yahoo.com/oauth2/get_token',
      form: {
        code: req.body.code,
        client_id: config.auth.yahoo.clientId,
        client_secret: config.auth.yahoo.clientSecret,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }, function (err, response, body) {
      try {
        if (!err && response.statusCode === 200) {
          var responseJson = JSON.parse(body)
          res.json(responseJson)
        } else {
          res.status(response.statusCode).json(err)
        }
      } catch (e) {
        res.status(500).json(err || e)
      }
    })
  }

oauthService = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  config.auth.twitter.clientId,
  config.auth.twitter.clientSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
)

function twitterAuth(req, res) {
  if (!req.body.oauth_token) {
    oauthService.getOAuthRequestToken({ oauth_callback: req.body.redirectUri }, function (error, oauthToken, oauthTokenSecret, results) {
      if (error) {
        res.status(500).json(error)
      } else {
        res.json({
          oauth_token: oauthToken,
          oauth_token_secret: oauthTokenSecret
        })
      }
    })
  } else {
    oauthService.getOAuthAccessToken(req.body.oauth_token, null, req.body.oauth_verifier, function (error, oauthAccessToken, oauthAccessTokenSecret, results) {

      if (error) {
        res.status(500).json(error)
      } else {
        var verifyCredentialsUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json'
        var parameters = {
          oauth_consumer_key: config.auth.twitter.clientId,
          oauth_token: oauthAccessToken,
          oauth_nonce: ('vueauth-' + new Date().getTime()),
          oauth_timestamp: timestamp.now(),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_version: '1.0'
        }

        var signature = oauthSignature.generate('GET', verifyCredentialsUrl, parameters, config.auth.twitter.clientSecret, oauthAccessTokenSecret)

        Axios.get('https://api.twitter.com/1.1/account/verify_credentials.json', { 
          headers: {
            Authorization:  'OAuth ' +
              'oauth_consumer_key="' + config.auth.twitter.clientId + '",' +
              'oauth_token="' + oauthAccessToken + '",' +
              'oauth_nonce="' + parameters.oauth_nonce + '",' +
              'oauth_timestamp="' + parameters.oauth_timestamp + '",' +
              'oauth_signature_method="HMAC-SHA1",'+
              'oauth_version="1.0",' +
              'oauth_signature="' + signature + '"'
          }
        }).then(function (response) {
          res.json({
            access_token: oauthAccessToken,
            access_token_secret: oauthAccessTokenSecret,

            profile: response.data
          })
        }).catch(function (err) {
          console.log(err.response.data.errors)
          res.status(500).json(err.response.data.errors)
        })
      }
    })
  }
}
