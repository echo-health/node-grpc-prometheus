const debug = require('debug')('prometheus:middleware');
const grpc = require('grpc');

const metrics = {};
const defaultBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
const statusCodes = Object.keys(grpc.status).reduce((acc, value, i) => {
    acc[grpc.status[value]] = value
    return acc;
}, {});

function configureMetrics(options) {
    metrics.grpcServerStartedTotal = new options.client.Counter({
        labelNames: ['grpc_type', 'grpc_service', 'grpc_method'],
        name: 'grpc_server_started_total',
        help: 'Total number of RPCs started on the server.',
    });
    metrics.grpcServerHandledTotal = new options.client.Counter({
        labelNames: ['grpc_type', 'grpc_service', 'grpc_method', 'grpc_code'],
        name: 'grpc_server_handled_total',
        help: 'Total number of RPCs completed on the server, regardless of success or failure.',
    });
    metrics.grpcServerHandlingSeconds = new options.client.Histogram({
        labelNames: ['grpc_type', 'grpc_service', 'grpc_method', 'grpc_code'],
        name: 'grpc_server_handling_seconds',
        buckets: options.buckets,
        help: 'Histogram of response latency (seconds) of gRPC that had been application-level handled by the server.Duration of HTTP response size in bytes',
    });
}

function getMicroseconds() {
    const now = process.hrtime();
    return now[0] * 1000000 + now[1] / 1000;
}

const grpcMetricsMiddleware = async (ctx, next) => {
    const startEpoch = getMicroseconds();    
    metrics.grpcServerStartedTotal
        .labels(ctx.service.type, ctx.service.name, ctx.service.method)
        .inc();

    await next();

    metrics.grpcServerHandledTotal
        .labels(ctx.service.type, ctx.service.name, ctx.service.method, statusCodes[ctx.status.code])
        .inc();

    metrics.grpcServerHandlingSeconds
        .labels(ctx.service.type, ctx.service.name, ctx.service.method, statusCodes[ctx.status.code])
        // convert back to seconds which is what our bucket values split on for latency
        .observe((getMicroseconds() - startEpoch) / 1000000);
}

function exponentialBuckets(start, factor, count){
    return [...Array(count).keys()].reduce((a, i) => {
        a = a * factor;
        return a;
    }, start)
}

module.exports = (options = {}) => {
    if (!options.client) {
        options.client = require('prom-client');
        require('prometheus-gc-stats')(options.client.register)();
    }
    options.client.collectDefaultMetrics();

    if (!options.bucket) {
        options.buckets = defaultBuckets;
    }

    configureMetrics(options);

    return {
        grpcMetricsMiddleware,
        exponentialBuckets,
        client: options.client
    }
};

