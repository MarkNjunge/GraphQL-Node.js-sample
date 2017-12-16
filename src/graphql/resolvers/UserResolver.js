const createResolver = require('apollo-resolvers').createResolver

const User = require('./../../database/user').User
const connector = require('./../connector')
const CustomErrors = require('./../errors')

const baseResolver = createResolver((root, args, context, error) => {
	const user = context.user
	if (!user) {
		throw new CustomErrors.Unauthorized()
	}
})

const resolvers = {
	Query: {
		users(_, args) {
			const filter = {}

			const fullname = args.fullname ? args.fullname.toLowerCase() : ''
			filter.fullname = {
				$regex: '.*' + fullname + '.*'
			}

			return User.findAll(filter)
		},
		user(_, args) {
			return User.findOne(args.id)
		},
		currentUser(_, args, context) {
			return User.findOne(context.user.id)
		}
	},
	Mutation: {
		register(_, args) {
			return User.register(
				args.fullname,
				args.email,
				args.photoUrl,
				args.password
			).catch(reason => {
				throw new CustomErrors.BasicError({
					message: reason
				})
			})
		},
		login(_, args) {
			return User.login(args.email, args.password).catch(reason => {
				throw new CustomErrors.BasicError({
					message: reason
				})
			})
		},
		updateUser: baseResolver.createResolver((_, args, context) => {
			return User.update(
				context.user.id,
				args.fullname,
				args.email,
				args.photoUrl
			).catch(reason => {
				throw new CustomErrors.BasicError({
					message: reason
				})
			})
		}),
		changePassword: baseResolver.createResolver((_, args, context) => {
			return User.changePassword(
				context.user.id,
				args.currentPassword,
				args.newPassword
			).catch(reason => {
				throw new CustomErrors.BasicError({
					message: reason
				})
			})
		})
	},
	User: {
		posts(user) {
			return connector.getAllPostsByUser(user.id)
		}
	}
}

module.exports = resolvers
