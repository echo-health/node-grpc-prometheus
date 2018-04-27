const server = require('../fakes/server');

test('test', async () =>  {
    var s = server.start();
    console.log('started server');
    s.forceShutdown();
});
