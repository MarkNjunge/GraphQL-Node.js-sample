const Mongoose = require('mongoose')

const PostSchema = Mongoose.Schema({
  id: String,
  title: String,
  body: String,
  posted: Number,
  edited: {
    type: Boolean,
    default: false
  },
  userId: String
})

module.exports = Mongoose.model('post', PostSchema)
