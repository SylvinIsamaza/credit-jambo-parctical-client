interface QueueJob {
  id: string;
  type: string;
  data: any;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processAt: Date;
}

class InMemoryQueue {
  private jobs: QueueJob[] = [];
  private processing = false;
  private processors: Map<string, Function> = new Map();

  addJob(type: string, data: any, delay: number = 0): string {
    const job: QueueJob = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date(),
      processAt: new Date(Date.now() + delay)
    };

    this.jobs.push(job);
    this.processJobs();
    return job.id;
  }

  registerProcessor(type: string, processor: Function) {
    this.processors.set(type, processor);
  }

  private async processJobs() {
    if (this.processing) return;
    this.processing = true;

    while (this.jobs.length > 0) {
      const job = this.jobs.find(j => j.processAt <= new Date());
      if (!job) break;

      const processor = this.processors.get(job.type);
      if (!processor) {
        this.jobs = this.jobs.filter(j => j.id !== job.id);
        continue;
      }

      try {
        await processor(job.data);
        this.jobs = this.jobs.filter(j => j.id !== job.id);
      } catch (error) {
        job.attempts++;
        if (job.attempts >= job.maxAttempts) {
          console.error(`Job ${job.id} failed after ${job.maxAttempts} attempts:`, error);
          this.jobs = this.jobs.filter(j => j.id !== job.id);
        } else {
          job.processAt = new Date(Date.now() + Math.pow(2, job.attempts) * 1000);
        }
      }
    }

    this.processing = false;
  }
}

export const queueService = new InMemoryQueue();