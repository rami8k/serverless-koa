'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const koaServer = require('./server')
const server = awsServerlessExpress.createServer(koaServer.callback())

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)