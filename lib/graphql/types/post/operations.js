const Mongoose = require('mongoose')
const moment = require('moment')

const PostModel = require('./model')

const Post = {
  findAll(filter, limit, postedSort) {
    return PostModel.find(filter)
      .limit(limit)
      .sort({
        posted: postedSort
      })
      .exec()
  },
  findOne(filter) {
    return PostModel.findOne(filter).exec()
  },
  add(title, body, userId) {
    const post = new PostModel({
      id: Mongoose.Types.ObjectId(),
      title: title,
      body: body,
      posted: moment().format('X'),
      userId: userId
    })
    return post.save()
  },
  delete(postId, userId) {
    return new Promise((resolve, reject) => {
      validateExistence(postId)
        .then(() => verifyIsByUser(postId, userId))
        .then(() => {
          PostModel.remove(
            {
              id: postId
            },
            err => {
              if (err) reject(err.message)

              resolve('The post has been deleted.')
            }
          )
        })
        .catch(reason => {
          reject(reason)
        })
    })
  },
  update(postId, body, userId) {
    return new Promise((resolve, reject) => {
      validateExistence(postId)
        .then(() => verifyIsByUser(postId, userId))
        .then(() => {
          const updatedPost = {
            id: postId,
            body,
            edited: true
          }
          PostModel.update(
            {
              id: postId
            },
            updatedPost,
            err => {
              if (err) reject(err)

              resolve('The post has been updated.')
            }
          )
        })
        .catch(reason => {
          reject(reason)
        })
    })
  }
}

function validateExistence(id) {
  return new Promise((resolve, reject) => {
    Post.findOne({
      id: id
    })
      .then(value => {
        if (value === null) reject('There is no post with that id.')

        resolve(value)
      })
      .catch(err => reject(err.message))
  })
}

function verifyIsByUser(postId, userId) {
  return new Promise((resolve, reject) => {
    Post.findOne({
      id: postId,
      userId: userId
    })
      .then(value => {
        if (value === null) reject('The post is not by that user.')

        resolve(value)
      })
      .catch(err => reject(err.message))
  })
}

module.exports = Post
