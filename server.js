const next = require('next');
const express = require('express');
const collector = require('./lib/collector');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const createServer = () => {
  const server = express();
  server.get('/collector', async function (req, res) {
    const { comments, date, commentTrends: trends } = await collector();
    res.send({comments, date, trends});
  })
  server.get('*', (req, res) => {
    handle(req, res)
  });
  return server;
}

if (process.env.IN_LAMBDA) {
  module.exports = createServer(); // no listen() for aws lambda
} else {
  app.prepare().then(() => {
    const server = createServer();
    server.listen(3000);
  })
}
