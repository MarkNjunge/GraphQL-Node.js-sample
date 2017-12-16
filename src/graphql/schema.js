const { makeExecutableSchema } = require('graphql-tools')
const { mergeTypes, fileLoader } = require('merge-graphql-schemas')
const path = require('path')

const resolvers = require('./resolver').resolvers

const typesArray = fileLoader(path.join(__dirname, './schemas'))

const schema = makeExecutableSchema({
	typeDefs: mergeTypes(typesArray),
	resolvers
})

module.exports = {
	schema
}
