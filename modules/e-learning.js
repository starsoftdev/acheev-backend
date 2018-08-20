var express = require('express')
var router = express.Router()
var lecture = require('../models/e-learning').lecture
var user = require('../models/user')

// require('mongoose').set('debug', true)
// Return a HTML with the fix amount of tutorial
router.get('/byUser', function (req, res, next) {
  // console.log(req.query)
  const {userEmail, type} = req.query
  if (!userEmail || !type) return next(new Error('wrong param'))
  if (type === 'creator') {
    lecture.find({authorEmail: userEmail}, function (err, lecturesInfo) {
      if (err) return next(new Error('db error'))
      res.send(lecturesInfo)
    })
  } else if (type === 'user') {
    var userEnrolled = []
    user.find({email: userEmail}, function (err, lecturesInfo) {
      if (err) return next(new Error('db error'))
      lecturesInfo.enrolledCourses.forEach(async function (course) {
        var singleCourse = await lecture.find({lectureName: course}, function (err, lecturesInfo) {
          if (err) return next(new Error('db error'))
          return lecture
        })
        userEnrolled.push(singleCourse)
      })
      res.send(userEnrolled)
    })
  }
})

// Return more tutiorial when this is called
router.get('/byCat', function (req, res, next) {
  const {category, count} = req.query
  if (!category || !count) return next(new Error('wrong param'))
  if (category === 'all') {
    lecture.find({}, function (err, lecturesInfo) {
      console.log(err)
      if (err) return next(new Error('db error'))
      res.send(lecturesInfo)
    }).limit(parseInt(count, 10))
  } else {
    lecture.find({category: category}, function (err, lecturesInfo) {
      console.log(err)
      if (err) return next(new Error('db error'))
      res.send(lecturesInfo)
    }).limit(parseInt(count, 10))
  }
})

router.post('/join', function (req, res, next) {
  if (!req.session.userEmail) return next(new Error('guest not allowed to join course'))
  const { lectureName } = req.body
  user.findOne({email: req.session.userEmail}, function (error, user) {
    if (error) {
      return next(error)
    } else {
      user.enrolledCourses.push(lectureName)
      user.save()
      res.status = 200
      return res.send('succuess')
    }
  })
})
// Write to db
router.post('/create', function (req, res, next) {
  // Check for authorization
  console.log(req.session.creator)
  console.log(req.body)
  if (req.session.creator) return next(new Error('user is not a creator'))

  // Write to DB, upload video to our storing api
  const {
    lectureName,
    lectureLength,
    videosUrl,
    thumbnail,
    description,
    comments,
    relatedSkills,
    author
  } = req.body

  var dateCreated = Date.now()
  var dateModified = dateCreated
  let lectureParams = {
    lectureName,
    lectureLength,
    videosUrl,
    thumbnail,
    description,
    comments,
    relatedSkills,
    author,
    dateCreated,
    dateModified
  }
  lecture.create({lectureParams}, function (error, tut) {
    if (error) {
      console.log(lectureParams)
      return next(error)
    } else {
      req.session.userId = tut._id
      return res.redirect('/')
    }
  })
})

// define as the last app.use callback
router.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
})

module.exports = router
