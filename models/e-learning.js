var mongoose = require('mongoose')

var lectureSchema = new mongoose.Schema({
  lectureName: {
    type: String,
    // required: true,
    trim: true
  },
  lectureLength: {
    type: String,
    // required: true,
    trim: true
  },
  videos: {
    type: Array,
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

var lecture = mongoose.model('lectures', lectureSchema)
module.exports = {
  lecture
}
