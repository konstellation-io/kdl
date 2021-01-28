const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const mocks = require('./mock');

const app = express();
const allowList = ['http://localhost:3000', 'http://localhost:3001'];
app.use(bodyParser.json(), cors({ origin: allowList, credentials: true }));

// # This endpoint is used to test unauthorized response
// app.post('/graphql', (req, res) => {
//   return res.status(401)
//     .send({"code": "unauthorized", "message": "Unauthorized user"});
// });

const server = new ApolloServer({ typeDefs, mocks });

server.applyMiddleware({ app, path: '/graphql', cors: false });

const appServer = app.listen(4000, () => {
  const address = appServer.address();
  console.log(`🚀 Server ready at ${address.address}${address.port}`);
});
