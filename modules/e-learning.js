var express = require('express')
var router = express.Router()
var path = require('path')

router.get('/', function (req, res, next) {
  console.log('qwe')
  res.send("asd")
})
module.exports = router
