const AWS = require('aws-sdk')
const fs = require('fs')
const restify = require('restify')
const plugins = require('restify-plugins')
const mongoose = require('mongoose')

global.server = restify.createServer({
  name: 'trumpsdubs',
  version: '1.0.0'
})

server.use(plugins.acceptParser(server.acceptable))
server.use(plugins.queryParser())
server.use(plugins.bodyParser({ mapParams: true }))
server.use(restify.CORS())

global.db = mongoose.connect(process.env.MONGODB_URI)

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
})

global.s3 = new AWS.S3({ apiVersion: '2006-03-01' })

server.listen(process.env.PORT || 8080, () => {
  require('./routes')
})

server.get(/\/public\/?.*/, restify.serveStatic({
    directory: __dirname
}))
