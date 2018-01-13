const Mongoose = require('mongoose')

const UserSchema = Mongoose.Schema({
  id: String,
  fullname: String,
  email: {
    type: String,
    unique: true
  },
  photoUrl: {
    type: String,
    default: 'http://via.placeholder.com/500x500'
  },
  password: String,
  role: String
})

module.exports = Mongoose.model('user', UserSchema)
