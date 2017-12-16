const merge = require('lodash').merge

const connector = require('./connector')

const UserResolvers = require('./resolvers/PostResolver')
const PostResolvers = require('./resolvers/UserResolver')

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
	}
}

const resolvers = merge(OtherResolvers, UserResolvers, PostResolvers)

module.exports = {
	resolvers
}
