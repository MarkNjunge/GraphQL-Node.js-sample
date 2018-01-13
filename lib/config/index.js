let mongo = {}

if (process.env.ENVIRONMENT == 'production') {
  mongo = {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    db: process.env.MONGO_DB,
  }
}
else {
  mongo = {
    user: process.env.MONGO_USER_DEVELOPMENT,
    password: process.env.MONGO_PASSWORD_DEVELOPMENT,
    host: process.env.MONGO_HOST_DEVELOPMENT,
    port: process.env.MONGO_PORT_DEVELOPMENT,
    db: process.env.MONGO_DB_DEVELOPMENT,
  }
}

module.exports = {
  mongo,
  JWT_SECRET: process.env.JWT_SECRET
}