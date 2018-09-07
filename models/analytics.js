var mongoose = require('mongoose')

var revenueSchema = new mongoose.Schema({
  revenue: {
    type: Number,
    required: true
  },
  dateCreated: {
    type: Date
    // required: true
  }
})

var revenue = mongoose.model('analytics', revenueSchema)
module.exports = {
  revenue
}
