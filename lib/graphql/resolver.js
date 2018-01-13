const { mergeResolvers } = require('merge-graphql-schemas')

const UserResolvers = require('./resolvers/PostResolver')
const PostResolvers = require('./resolvers/UserResolver')

const resolvers = [UserResolvers, PostResolvers]

module.exports = mergeResolvers(resolvers)
