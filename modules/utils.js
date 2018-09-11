var User = require('../models/user')

// make function for modifying fields in mongo when a post request from frontend Node is called
function modifyOrCreateFields (userEmail, query) {
  User.findById(userEmail)
    .exec(function (error, user) {
      if (error) {
        throw error
      } else {
        if (user === null) {
          let err = new Error('User not found')
          err.status = 400
          throw err
        } else {
          let o = null
          Object.keys(o).forEach(function (key) {
            var val = o[key]
            user.key = val
          })
        }
      }
    })
}

module.exports = {
  modifyOrCreateFields
}
