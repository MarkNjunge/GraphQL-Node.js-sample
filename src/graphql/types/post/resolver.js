const createResolver = require('apollo-resolvers').createResolver

const Post = require('./model').Post
const CustomErrors = require('../../errors')

const baseResolver = createResolver((root, args, context, error) => {
  const user = context.user
  if (!user) {
    throw new CustomErrors.Unauthorized()
  }
})

const resolvers = {
  Query: {
    posts(_, args) {
      const limit = args.limit ? args.limit : 0

      let postedSort = -1
      if(args.sort && args.sort == 'POSTED_ACS'){
        postedSort = 1
      }
      return Post.findAll({}, limit, postedSort)
    },
    post(_, args) {
      return Post.findOne(args)
    }
  },
  Mutation: {
    addPost: baseResolver.createResolver(
      (_, args, context) => {
        return new Promise((resolve, reject) => {
            Post.add(args.title, args.body, context.user.id)
              .then(post => resolve(post))
          })
          .catch(reason => {
            throw new CustomErrors.BasicError({
              message: reason
            })
          })
      }
    ),
    deletePost: baseResolver.createResolver((_, args, context) => {
      return Post.delete(args.id, context.user.id)
        .catch(reason => {
          throw new CustomErrors.BasicError({
            message: reason
          })
        })
    }),
    updatePost: baseResolver.createResolver((_, args, context) => {
      return Post.update(args.id, args.body, context.user.id)
        .catch(reason => {
          throw new CustomErrors.BasicError({
            message: reason
          })
        })
    })
  }
}

module.exports = {
  resolvers
}