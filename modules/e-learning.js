var express = require('express')
var router = express.Router()
var async = require('async')
var path = require('path')
var Elearning = require('../models/e-learning')

// Double check when I get home

// Return a HTML with the fix amount of tutorial
router.get('/', function (req, res, next) {
  const {count} = req.querys
  Elearning.findOne({email: req.body.email}, function (err, user) {

  })

  res.send( ) //Random 20 elearning from DB
})

// Return more tutiorial when this is called
router.get('/getMore', function (req, res, next) {
  const {count} = req.querys
  Elearning.findOne({email: req.body.email}, function (err, user) {

  })

  res.send( ) //Random 20 elearning from DB
})


// Write to db
router.post('/', function (req, res, next) {
  // Check for authorization

  // Write to DB, upload video to our storing api
})
module.exports = router
