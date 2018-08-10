var mongoose = require('mongoose')

var ResetSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

var Reset = mongoose.model('Reset', ResetSchema)
module.exports = Reset
