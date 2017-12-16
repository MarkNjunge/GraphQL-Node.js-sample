const createResolver = require('apollo-resolvers').createResolver
const CustomErrors = require('./../errors')

const isAuthenticatedResolver = createResolver((root, args, context, error) => {
	const user = context.user
	if (!user) {
		throw new CustomErrors.Unauthorized()
	}
})

module.exports = { isAuthenticatedResolver }
