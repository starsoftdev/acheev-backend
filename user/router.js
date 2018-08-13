var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Reset = require('../models/resetPass')
var async = require('async')
var crypto = require('crypto')
var nodemailer = require('nodemailer')
var path = require('path')

router.get('/reset/:token', function (req, res, next) {
  Reset.findOne({resetPasswordToken: req.params.token}, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.')
      return res.redirect('/')
    }
    return res.sendFile(path.join(__dirname + '/../templateLogReg/forget.html'))
  })
})

router.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      Reset.findOne({resetPasswordToken: req.params.token}, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.')
          return res.redirect('back')
        }

        User.findOne({}, function (err, user) {
          user.password = req.body.password
          user.save()
        })
        user.remove(function (err) {
          done(err, user)
        })
      })
    }
  ], function (err) {
    res.redirect('/')
  })
})

router.post('/forget', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        let token = buf.toString('hex')
        done(err, token)
      })
    },
    function (token, done) {
      User.findOne({email: req.body.email}, function (err, user) {
        if (!user || err) {
          req.flash('error', 'No account with that email address exists.')
          return res.redirect('/')
        }
        console.log(111)
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
        var resetUser = {
          resetPasswordToken: user.resetPasswordToken,
          resetPasswordExpires: user.resetPasswordExpires,
          email: user.email
        }
        Reset.update(resetUser, function (error) {
          if (error) {
            return next(error)
          }
          done(err, token, user)
        })
      })
    },
    function (token, user, done) {
      console.log(user.email)
      let smtpTransport = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        auth: {
          user: 'Richard@acheev.co',
          pass: 'Richard@123'
        },
        secureConnection: false // TLS requires secureConnection to be false
      })

      let mailOptions = {
        to: user.email,
        from: 'Richard@acheev.co',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.')

        done(err, 'done')
      })
    }
  ], function (err) {
    console.log(err)
    if (err) return next(err)
  })
})

// GET route for reading data
router.get('/login', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'))
})

router.post('/login', function (req, res, next) {
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        let err = new Error('Wrong email or password.')
        err.status = 401
        return next(err)
      } else {
        req.session.userId = user._id
        req.session.email = req.body.logemail
        return res.redirect('/profile')
      }
    })
  }
})

// POST route for updating data
router.post('/register', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.')
    err.status = 400
    res.send('passwords dont match')
    return next(err)
  }

  if (req.body.email &&
    req.body.firstname &&
    req.body.lastname &&
    req.body.password &&
    req.body.passwordConf) {
    let userData = {
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error)
      } else {
        req.session.userId = user._id
        return res.redirect('/profile')
      }
    })
  } else {
    var err = new Error('All fields required.')
    err.status = 400
    return next(err)
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  console.log(req.session)
  
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error)
      } else {
        if (user === null) {
          let err = new Error('Not authorized! Go back!')
          err.status = 400
          return next(err)
        } else {
          return res.send('<h1>Name: </h1>' + user.firstname + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    })
})

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/')
      }
    })
  }
})

module.exports = router
