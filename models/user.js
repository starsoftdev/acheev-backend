var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  admin: {
    type: Boolean,
    default: 0,
    trim: true
  },
  enrolledCourses: {
    type: Array,
    trim: true
  },
  servicePaid: {
    type: Array,
    trim: true
  },
  skills: {
    type: Array,
    trim: true
  },
  certifcations: {
    type: Array,
    trim: true
  },
  organization: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  subscription: {
    type: String
  },
  subscription_expire: {
    type: Date
  }
})

var SocialMediaSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true
  },
  facebook: {
    type: String,
    unique: true,
    trim: true
  },
  linkedin: {
    type: String,
    unique: true,
    trim: true
  },
  twitter: {
    type: String,
    unique: true,
    trim: true
  },
  personalWebsite: {
    type: String,
    unique: true,
    trim: true
  }
})

var UserRatingSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true
  },
  overAll: {
    type: Number,
    unique: true,
    trim: true
  },
  communication: {
    type: Number,
    unique: true,
    trim: true
  },
  serviceIntegrity: {
    type: Number,
    unique: true,
    trim: true
  },
  wouldRecommand: {
    type: Number,
    unique: true,
    trim: true
  }
})

var AddressSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  home: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: Boolean,
    default: 0,
    trim: true
  }
})

// authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({email: email})
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.')
        err.status = 401
        return callback(err)
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user)
        } else {
          return callback()
        }
      })
    })
};

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  let user = this
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err)
    }
    user.password = hash
    next()
  })
})

var SocialMedia = mongoose.model('socialMedia', SocialMediaSchema)
var User = mongoose.model('User', UserSchema)
var Address = mongoose.model('Address', AddressSchema)
var UserRating = mongoose.model('UserRating', UserRatingSchema)
module.exports = {
  User,
  Address,
  UserRating,
  SocialMedia
}
