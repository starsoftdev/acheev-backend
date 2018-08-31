var express = require('express')
var router = express.Router()
var multer = require('multer')
var path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.mkv')
  }
})
var upload = multer({ storage: storage}).single('userPhoto')

router.get('/', function (req, res) {
  console.log('QWE')
  return res.sendFile(path.join(__dirname, '/../views/uploadVideo.html'))
})

router.post('/', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.end('Error uploading file.')
    }
    res.end('File is uploaded')
  })
})

module.exports = router
