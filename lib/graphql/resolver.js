const { mergeResolvers } = require('merge-graphql-schemas')

const UserResolvers = require('./types/user/resolver')
const PostResolvers = require('./types/post/resolver')

const resolvers = [UserResolvers, PostResolvers]

module.exports = mergeResolvers(resolvers)
