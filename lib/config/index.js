function mongoUri() {
  if (process.env.NODE_ENV == 'production') {
    return process.env.MONGODB_URI
  } else {
    return process.env.MONGODB_URI_DEV
  }
}

module.exports = {
  mongoUri: mongoUri(),
  JWT_SECRET: process.env.JWT_SECRET
}
