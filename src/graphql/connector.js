const Post = require('./types/post/model').Post
const User = require('./types/user/model').User

function getAllPostsByUser(id) {
  return Post.findAll({
    userId: id
  }, 0, 1)
}

function getPostAuthor(id) {
  return User.findOne(id)
}

module.exports = {
  getAllPostsByUser,
  getPostAuthor
}