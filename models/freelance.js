var mongoose = require('mongoose')

var freeLanceSchema = new mongoose.Schema({
  freeLanceName: {
    type: String,
    // required: true,
    trim: true
  },
  freeLanceLength: {
    type: String,
    // required: true,
    trim: true
  },
  offers: {
    type: Array
  },
  videos: {
    type: Array,
    // required: true,
    trim: true
  },
  purchases: {
    type: Number,
    // required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    // required: true,
    trim: true
  },
  description: {
    type: String,
    // required: true,
    trim: true
  },
  comments: {
    type: Array
  },
  category: {
    type: Number
    // required: true
  },
  relatedSkills: {
    type: Array
    // required: true
  },
  authorEmail: {
    type: String
    // required: true
  },
  dateCreated: {
    type: Date
    // required: true
  },
  dateModified: {
    type: Date
    // required: true
  }
})

var freeLance = mongoose.model('freeLances', freeLanceSchema)
module.exports = {
  freeLance
}
