const merge = require('lodash').merge

const connector = require('./connector')

const UserResolvers = require('./types/user/resolver').resolvers
const PostResolvers = require('./types/post/resolver').resolvers

const OtherResolvers = {
  User: {
    posts(user) {
      return connector.getAllPostsByUser(user.id)
    }
  },
  Post: {
    user(post) {
      return connector.getPostAuthor(post.userId)
    }
  },
}

const resolvers = merge(OtherResolvers, UserResolvers, PostResolvers)

module.exports = {
  resolvers
}