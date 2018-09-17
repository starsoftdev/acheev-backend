var User = require('../models/user').User
var Address = require('../models/user').Address
var UserRating = require('../models/user').UserRating
var SocialMedia = require('../models/user').SocialMedia
var EnrolledCourses = require('../models/user').EnrolledCourses
var ServicePaid = require('../models/user').ServicePaid
var Skill = require('../models/user').Skill

// *** add more
/// schema needs to be right
let dbMap = {
  'account': User,
  'address': Address,
  'userRating': UserRating,
  'socialMedia': SocialMedia,
  'enrolledCourses': EnrolledCourses,
  'servicePaid': ServicePaid,
  'skill': Skill
}

function createDocument (curIndex, body) {
  console.log(123)
  dbMap[curIndex].create(body, function (error) {
    if (error) {
      return error
    }
  })
}

// make function for modifying fields in mongo when a post request from frontend Node is called
function modifyOrCreateFields (userEmail, curIndex, query) {
  console.log(111)
  dbMap[curIndex].update({'email': userEmail}, {'firstname': 14, 'lastname': 12, 'admin':1}, function (err) {
    console.log(err)
  })

  // dbMap[curIndex].findOne({'email': userEmail})
  //   .exec(function (error, insert) {
  //     if (error) {
  //       throw error
  //     } else {
  //       if (insert === null) {
  //         let err = new Error('Column not found')
  //         err.status = 400
  //         throw err
  //       } else {
  //         console.log(insert)
  //         console.log(insert.firstname)
  //         insert['firstname'] = 'qweq'
  //         console.log(insert.firstname)
  //         insert.save(function (error, user) {
  //           console.log(error)
  //         })
  //         // Object.keys(query).forEach(function (key) {
  //         //   var val = query[key]
  //         //   console.log(insert)
  //         //   insert[key] = val
  //         //   console.log(insert)
  //         //   insert.save()
  //         //   return 'done'
  //         // })
  //       }
  //     }
  //   })
}

async function getFields (userEmail, query) {
  console.log(userEmail)
  let ret = {}
  for (var i = 0; i < query.length; i++) {
    ret[query[i]] = await dbMap[query[i]].findOne({email: userEmail})
    console.log(ret)
  }
  return ret
}

module.exports = {
  modifyOrCreateFields,
  getFields,
  createDocument
}
