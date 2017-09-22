const createError = require('apollo-errors').createError

module.exports = {
  Unauthorized: createError('Unauthorized access', {
    message: 'You are missing the required authorization header.',
    data: {
      status: 401
    }
  }),
  BasicError: createError('Error', {
    message: 'An error has ocurred'
  })
}