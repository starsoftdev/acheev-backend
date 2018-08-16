var mongoose = require('mongoose')

var elearningSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true
  },
  tutiorialLength: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  tutiorialName: {
    type: String,
    required: true
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
var lectureSchema = new mongoose.Schema({
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
var lecture = mongoose.model('Lecture', lectureSchema)
module.exports = {
  elearning,
  lecture
}
