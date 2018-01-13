const { isAuthenticatedResolver } = require('./BaseResolvers')

const Post = require('./../../database/post').Post
const connector = require('./../connector')
const CustomErrors = require('./../errors')

const resolvers = {
	Query: {
		posts(_, args) {
			const limit = args.limit ? args.limit : 0

			let postedSort = -1
			if (args.sort && args.sort == 'POSTED_ACS') {
				postedSort = 1
			}
			return Post.findAll({}, limit, postedSort)
		},
		post(_, args) {
			return Post.findOne(args)
		}
	},
	Mutation: {
		addPost: isAuthenticatedResolver.createResolver((_, args, context) => {
			return new Promise((resolve, reject) => {
				Post.add(args.title, args.body, context.user.id).then(post =>
					resolve(post)
				)
			}).catch(reason => {
				throw new CustomErrors.BasicError({
					message: reason
				})
			})
		}),
		deletePost: isAuthenticatedResolver.createResolver((_, args, context) => {
			return Post.delete(args.id, context.user.id).catch(reason => {
				throw new CustomErrors.BasicError({
					message: reason
				})
			})
		}),
		updatePost: isAuthenticatedResolver.createResolver((_, args, context) => {
			return Post.update(args.id, args.body, context.user.id).catch(reason => {
				throw new CustomErrors.BasicError({
					message: reason
				})
			})
		})
	},
	Post: {
		user(post) {
			return connector.getPostAuthor(post.userId)
		}
	}
}

module.exports = resolvers
