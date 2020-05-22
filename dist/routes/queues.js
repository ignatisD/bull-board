"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_info_1 = require("redis-info");
const metrics = [
    'redis_version',
    'used_memory',
    'mem_fragmentation_ratio',
    'connected_clients',
    'blocked_clients',
];
const getStats = async ({ queue, }) => {
    const redisClient = await queue.client;
    const redisInfoRaw = await redisClient.info();
    const redisInfo = redis_info_1.parse(redisInfoRaw);
    const validMetrics = metrics.reduce((acc, metric) => {
        if (redisInfo[metric]) {
            acc[metric] = redisInfo[metric];
        }
        return acc;
    }, {});
    // eslint-disable-next-line @typescript-eslint/camelcase
    validMetrics.total_system_memory =
        redisInfo.total_system_memory || redisInfo.maxmemory;
    return validMetrics;
};
const formatJob = (job) => {
    const jobProps = job.toJSON();
    return {
        id: jobProps.id,
        timestamp: jobProps.timestamp,
        processedOn: jobProps.processedOn,
        finishedOn: jobProps.finishedOn,
        progress: jobProps.progress,
        attempts: jobProps.attemptsMade,
        delay: job.opts.delay,
        failedReason: jobProps.failedReason,
        stacktrace: jobProps.stacktrace,
        opts: jobProps.opts,
        data: jobProps.data,
        name: jobProps.name,
    };
};
const statuses = [
    'active',
    'completed',
    'delayed',
    'failed',
    'waiting',
];
const getDataForQueues = async (bullBoardQueues, req) => {
    const query = req.query || {};
    const pairs = Object.entries(bullBoardQueues);
    if (pairs.length == 0) {
        return {
            stats: {},
            queues: [],
        };
    }
    const queues = await Promise.all(pairs.map(async ([name, { queue }]) => {
        const counts = {
            'latest': 0,
            'active': 0,
            'completed': 0,
            'delayed': 0,
            'failed': 0,
            'waiting': 0,
            'paused': 0,
        };
        await Promise.all(statuses.map(status => {
            return queue.getJobCountByTypes(status).then(num => {
                counts[status] = num || 0;
            });
        }));
        const status = query[name] === 'latest' ? statuses : query[name];
        const jobs = await queue.getJobs(status, 0, 10);
        return {
            name,
            counts: counts,
            jobs: jobs.map(formatJob),
        };
    }));
    const stats = await getStats(pairs[0][1]);
    return {
        stats,
        queues,
    };
};
exports.queuesHandler = async (req, res) => {
    const { bullBoardQueues } = req.app.locals;
    res.json(await getDataForQueues(bullBoardQueues, req));
};
//# sourceMappingURL=queues.js.map