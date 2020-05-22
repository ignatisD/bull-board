import { parse as parseRedisInfo } from 'redis-info'
import { RequestHandler, Request } from 'express'
import { Job, JobStatus } from 'bull'

import * as api from '../@types/api'
import * as app from '../@types/app'
import { Status } from '../ui/components/constants'

type MetricName = keyof app.ValidMetrics

const metrics: MetricName[] = [
  'redis_version',
  'used_memory',
  'mem_fragmentation_ratio',
  'connected_clients',
  'blocked_clients',
]

const getStats = async ({
  queue,
}: app.BullBoardQueue): Promise<app.ValidMetrics> => {
  const redisClient = await queue.client
  const redisInfoRaw = await redisClient.info()
  const redisInfo = parseRedisInfo(redisInfoRaw)

  const validMetrics = metrics.reduce((acc, metric) => {
    if (redisInfo[metric]) {
      acc[metric] = redisInfo[metric]
    }

    return acc
  }, {} as Record<MetricName, string>)

  // eslint-disable-next-line @typescript-eslint/camelcase
  validMetrics.total_system_memory =
    redisInfo.total_system_memory || redisInfo.maxmemory

  return validMetrics
}

const formatJob = (job: Job): app.AppJob => {
  job = job || <any>{opts: {}};
  const jobProps = "toJSON" in job ? job.toJSON() : <any>{};

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
  }
}

const statuses: JobStatus[] = [
  'active',
  'completed',
  'delayed',
  'failed',
  'waiting',
]

const getDataForQueues = async (
  bullBoardQueues: app.BullBoardQueues,
  req: Request,
): Promise<api.GetQueues> => {
  const query = req.query || {}
  const pairs = Object.entries(bullBoardQueues)

  if (pairs.length == 0) {
    return {
      stats: {},
      queues: [],
    }
  }

  const queues: app.AppQueue[] = await Promise.all(
    pairs.map(async ([name, { queue }]) => {
      const counts: Record<Status, number> = {
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
          counts[status] = (num as any) || 0;
        })
      }))
      const status = query[name] === 'latest' ? statuses : query[name]
      const jobs: Job[] = await queue.getJobs(status, 0, 10)

      return {
        name,
        counts: counts,
        jobs: jobs.map(formatJob).filter(j => !!j.id),
      }
    }),
  )

  const stats = await getStats(pairs[0][1])

  return {
    stats,
    queues,
  }
}

export const queuesHandler: RequestHandler = async (req, res) => {
  const { bullBoardQueues } = req.app.locals

  res.json(await getDataForQueues(bullBoardQueues, req))
}
