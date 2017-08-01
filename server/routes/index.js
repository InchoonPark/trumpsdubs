'use strict';

server.opts(/\.*/, (req, res, next) => {
  res.send(200)
  next()
})

require('./dubs')
