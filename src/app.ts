import * as http from 'http'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { DocumentNode } from 'graphql'
import cors from 'cors'
import typeDefs from '@/graphql/typeDefs'
import resolvers from '@/graphql/resolvers'
import dotenv = require('dotenv')
import express = require('express')
import SocketIOServices from '@/socket/socket'
import authDirective from '@/directives/auth'
import appendConfigToRequest from '@/middleware/appendConfigToRequest'
import ensureAuthenticated from '@/middleware/authentication'
import routes from '@/routes'
import EmailServices from '@/controllers/EmailServices'
import runWorker from '@/workers'

const bodyParser = require('body-parser')

const { makeExecutableSchema } = require('@graphql-tools/schema')

const { parsed } = dotenv.config()

// TODO:
// initialIndices()

async function startApolloServer (typeDefs: DocumentNode[], resolvers: never[]) {
  const app = express()
  EmailServices.initEmailClient()
  app.use(cors())
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    schema: authDirective(
      makeExecutableSchema({
        typeDefs,
        resolvers
      }),
      'auth'
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: (params: any) => {
      return params.connection ? params.connection.context : { req: params.req, res: params.res }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(bodyParser.json())

  app.all('*', async (req, res, next) => {
    if (req.url === '/') {
      res.send({ code: 200, message: 'Welcome...' })
    } else {
      appendConfigToRequest(req, res, next)
    }
  })
  app.use('/api/', [ensureAuthenticated, appendConfigToRequest], routes.authRoutes)
  app.get('/healthz', function (req, res) {
    res.json({
      code: 0,
      data: 'OK'
    })
  })

  SocketIOServices.initSocketIO(httpServer)

  await server.start()
  server.applyMiddleware({ app, cors: true })
  httpServer.listen({
    port: process.env.PORT || parsed?.PORT
  })

  return server
}

startApolloServer(typeDefs, resolvers as unknown as never[]).then(async (server) => {
  runWorker()
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT || parsed?.PORT}${server.graphqlPath}`)
})
