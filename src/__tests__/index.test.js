const { client, grpcMetricsMiddleware, exponentialBuckets } = require('../index')();

test('test', async () => {
    const next = jest.fn();
    await grpcMetricsMiddleware(
        {
            call: null,
            service: {
                name: 'Test.Test',
                method: 'Test',
                type: 'unary',
            },
            status: {
                code: 0,
            },
        },
        next
    );

    const metricsToExist = {
        grpc_server_started_total: {
            type: client.Counter,
            value: 'grpc_method:Test,grpc_service:Test.Test,grpc_type:unary' 
        },
        grpc_server_handled_total: {
            type: client.Counter,
            value: 'grpc_code:OK,grpc_method:Test,grpc_service:Test.Test,grpc_type:unary' 
        },
        grpc_server_handling_seconds: {
            type: client.Histogram,
            value: 'grpc_code:OK,grpc_method:Test,grpc_service:Test.Test,grpc_type:unary' 
        },
    };
    Object.keys(metricsToExist).forEach(k => {
        const metric = client.register.getSingleMetric(k);
        const metrics = Object.keys(metric.hashMap);
        const expectation = metricsToExist[k];
        expect(metric).toBeInstanceOf(expectation.type);
        expect(metrics.length).toBe(1);
        expect(metrics[0]).toBe(expectation.value);
    });

});
