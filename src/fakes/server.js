const M = require('./proto');
const grpc = require('grpc');

function Greet(call, callback) {
  callback(null, {message: 'Hello ' + call.request.name});
}

function start() {
  var server = new grpc.Server();
  server.addProtoService(M.M.Messenger.service,{
    Greet : Greet
  });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  return server;
}
module.exports =  {
    start, 
}
