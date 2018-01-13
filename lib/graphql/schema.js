const { makeExecutableSchema } = require('graphql-tools')

const resolvers = require('./resolver')
const typeDefs = require('./types')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

module.exports = schema
