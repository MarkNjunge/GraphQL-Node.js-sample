const Post = require('./types/post/operations')
const User = require('./types/user/operations')

function getAllPostsByUser(id) {
  return Post.findAll(
    {
      userId: id
    },
    0,
    1
  )
}

function getPostAuthor(id) {
  return User.findOne(id)
}

module.exports = {
  getAllPostsByUser,
  getPostAuthor
}
