import { Process, Processor , OnQueueProgress, OnQueueActive ,  OnQueueCompleted , OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CheckJobService } from './check-job.service';

@Processor('checks')
export class CheckProcessor {
  constructor( 
    private readonly checkJobService:CheckJobService
	) {}

	private readonly logger = new Logger(CheckProcessor.name);

  @Process()
  async handleCheck(job: Job) {
    // this.logger.log( "Progress Job" ,{
    //   jobId : job.id,
    // });
    await this.checkJobService.handleCheckJob( job.data );
  }


  @OnQueueActive()
  onActive( job: Job ){
    this.logger.log( "activeJob" ,{
      jobId : job.id
    });
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log( "completeJob" ,{
      jobId : job.id
    });
  }
  @OnQueueFailed()
  onFailed(job: Job) {
    this.logger.log( "failedJob" ,{
      jobId : job.id,
      reason : job.failedReason
    });
  }
}