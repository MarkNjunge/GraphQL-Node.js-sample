const Mongoose = require('mongoose')
const chalk = require('chalk')
const { mongoUri } = require('../config/index')

Mongoose.Promise = global.Promise

function makeConnection() {
  return new Promise((resolve, reject) => {
    Mongoose.connect(mongoUri)
    const db = Mongoose.connection

    db.on('error', reason => {
      reject(reason)
    })

    db.on('open', () => {
      console.log(chalk.cyan('Connected to mongo.'))
      resolve()
    })

    db.on('disconnected', () => {
      console.log(chalk.red('Disconnected from mongo'))
    })
  })
}

module.exports = {
  makeConnection
}
