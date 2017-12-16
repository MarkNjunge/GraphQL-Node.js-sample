const _ = require('lodash')

const types = `
# A post. Only the user who created the post may make changes to it.
type Post{
  # Id of the post.
  id: String

  # Title of the post.
  title: String

  # Body of the post.
  body: String

  # Flag of whether the post has been edited after it was posted.
  edited: Boolean

  # The time (epoch time in seconds) the post was made.
  posted: Int

  # User who made the post.
  user: User
}

# Sort orders for a post.
enum PostSort{
  POSTED_ACS
  POSTED_DESC
}
`

const query = `
type Query{
  # Get all posts. The result can be limited and/or sorted.
  posts(limit: Int, sort: PostSort = POSTED_DESC): [Post]

  # Get a post based on it's id and/or title. 
  post(id: String, title: String): Post
}
`

const mutation = `
type Mutation{
  # Add a new post for the current user.
  addPost(title: String!, body: String!): Post

  # Delete a post based on an id. Post has to have been made by the current user.
  deletePost(id: String!): String

  # Update the body of a post. Post has to have been made by the current user.
  updatePost(id: String!, body: String!): String
}
`

module.exports = _.join([types, query, mutation])
