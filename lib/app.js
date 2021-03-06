const ip = require('ip')
const chalk = require('chalk')
const express = require('express')
const jwt = require('jsonwebtoken')
const url = require('url')
const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const bodyParser = require('body-parser')
const expressPlayground = require('graphql-playground-middleware-express')
  .default
const formatError = require('apollo-errors').formatError
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

require('dotenv').config()

const Database = require('./database')
const JWT_SECRET = require('./config').JWT_SECRET
const schema = require('./graphql/schema')

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
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:3000/subscriptions'
  })
)

// Add endpoint for Graphql Playground
app.get(
  '/playground',
  expressPlayground({
    endpoint: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:3000/subscriptions'
  })
)

// Setup graphql
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    formatError,
    schema,
    context: {
      user: req.user
    }
  }))
)

// Redirect from index page to playground
app.use('/', (req, res) => {
  res.redirect('/playground')
})

// Get port from run command or default to 3000
const PORT = process.argv[2] ? process.argv[2] : 3000

console.log(chalk.cyan('Starting server...'))

// Make database connection then start server if connected
Database.makeConnection()
  .then(() => {
    // Wrap the Express server to enable websockets
    const wsServer = createServer(app)

    wsServer.listen(PORT, () => {
      console.log(
        chalk.cyan(`Server successfully started on ${ip.address()}:${PORT}`)
      )

      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema
        },
        {
          server: wsServer,
          path: '/subscriptions'
        }
      )
    })
  })
  .catch(reason => {
    console.log(chalk.red(reason))
    process.exit()
  })
