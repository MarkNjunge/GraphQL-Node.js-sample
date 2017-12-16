const { makeExecutableSchema } = require('graphql-tools')
const { mergeTypes } = require('merge-graphql-schemas')

const resolvers = require('./resolver').resolvers
const UserTypeDefs = require('./schemas/UserSchema')
const PostTypeDefs = require('./schemas/PostSchema')

const baseTypeDefs = `
schema {
  query: Query
  mutation: Mutation
}
`

const schema = makeExecutableSchema({
	typeDefs: mergeTypes([baseTypeDefs, UserTypeDefs, PostTypeDefs]),
	resolvers
})

module.exports = {
	schema
}
