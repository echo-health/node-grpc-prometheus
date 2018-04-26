const grpc = require('grpc');

let grpcServer;

beforeAll(() => {
    // grpcServer = server.getServer();
    // grpcServer.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    // grpcServer.start();
});

beforeEach(() => {
});

afterEach(() => {
});

afterAll(() => {
    grpcServer.forceShutdown();
});