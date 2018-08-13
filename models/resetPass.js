var mongoose = require('mongoose')

var ResetSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, expires: 3600 }
})

var Reset = mongoose.model('Reset', ResetSchema)
module.exports = Reset
