const ip = require('ip')
const chalk = require('chalk')
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const formatError = require('apollo-errors').formatError
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')

require('dotenv').config()

const Database = require('./lib/database')
const JWT_SECRET = require('./lib/config').JWT_SECRET
const Schema = require('./lib/graphql/schema').schema

const app = express()

// Check for Authorization header and add user id to request if valid
app.use(req => {
  try {
    const token = req.header('Authorization')
    if (token != undefined) {
      const { user } = jwt.verify(token, JWT_SECRET)
      req.user = user
    }
  } catch (error) {
    console.log(error.message)
  }
  req.next()
})

// Add endpoint for graphiql
app.use(
  '/graphiql',
  bodyParser.json(),
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

// Setup graphql
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    formatError,
    schema: Schema,
    context: {
      user: req.user
    }
  }))
)

// Redirect from index page to graphiql
app.use('/', (req, res) => {
  res.redirect('/graphiql')
})

// Get port from run command or default to 3000
const PORT = process.argv[2] ? process.argv[2] : 3000

console.log(chalk.cyan('Starting server...'))

// Make database connection then start server if connected
Database.makeConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        chalk.cyan(`Server successfully started on ${ip.address()}:${PORT}`)
      )
    })
  })
  .catch(reason => {
    console.log(chalk.red(reason))
    process.exit()
  })
