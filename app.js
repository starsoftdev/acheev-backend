var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var login = require('./modules/login')
var payments = require('./modules/payments')
var elearning = require('./modules/e-learning')
var videoUpload = require('./modules/videoUpload')
var flash = require('connect-flash')
var path = require('path')

// connect to MongoDB
mongoose.connect('mongodb://acheev-backend_mongodb_1/testForAuth')
var db = mongoose.connection

// handle mongo error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  // we're connected!
})

var sessions = session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
})
// use sessions for tracking logins
app.use(sessions)
app.use(flash())

// parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// serve static files from template
app.use(express.static(path.join(__dirname, '/views')))

app.use('/payments', payments)
app.use('/e-learning', elearning)
// Test for upload video, should goto other modules later
app.use('/video', videoUpload)

app.use('/', login)

// catch 404 and fologinto error handler
app.use(function (req, res, next) {
  let err = new Error('File Not Found')
  err.status = 404
  next(err)
})

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
})

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000')
})
