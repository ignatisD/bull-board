import { Status } from '../ui/components/constants'
import { Queue, JobOptions, Job } from 'bull'

export interface BullBoardQueue {
  queue: Queue
}

export interface BullBoardQueues {
  [key: string]: BullBoardQueue
}

export interface ValidMetrics {
  total_system_memory: string
  redis_version: string
  used_memory: string
  mem_fragmentation_ratio: string
  connected_clients: string
  blocked_clients: string
}

export interface AppJob {
  id: string | number | undefined
  timestamp: number | null
  processedOn: number | null
  finishedOn: number | null
  progress: number
  attempts: Job['attemptsMade']
  failedReason: any
  stacktrace: string[] | null
  opts: JobOptions
  data: Job['data']
  name: Job['name']
  delay: number | undefined
}

export interface AppQueue {
  name: string
  counts: Record<Status, number>
  jobs: AppJob[]
}
