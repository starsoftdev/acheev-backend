var mongoose = require('mongoose')

var elearningSchema = new mongoose.Schema({
  tutorialName: {
    type: String,
    required: true
  },
  tutorialLength: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  staffPicked: {
    type: Boolean,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  dateModified: {
    type: Date,
    required: true
  }
})
var tutorialSchema = new mongoose.Schema({
  tutorialName: {
    type: String,
    required: true,
    trim: true
  },
  videos: {
    type: Array,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  comments: {
    type: Array
  },
  relatedSkills: {
    type: Array,
    required: true
  }
})

var elearning = mongoose.model('Elearning', elearningSchema)
var tutorial = mongoose.model('Tutorial', tutorialSchema)
module.exports = {
  elearning,
  lecture
}
