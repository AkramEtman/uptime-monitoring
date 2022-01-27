import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Check } from '../entities/check.entity';

@Injectable()
export class TasksService {
	
	constructor(
		private schedulerRegistry: SchedulerRegistry,
		@InjectQueue('checks') private checkQueue: Queue
	) {}
	
	private readonly logger = new Logger(TasksService.name);

	addCheckInterval( name:string, check:Check ) {
		const intervalMilliSecond = check.interval * 1000;
		const callback = async () => {
			this.logger.warn(`Interval ${check.name} executing at time (${intervalMilliSecond})!`);
			//add to queue
			await this.checkQueue.add(check);
		};
	
		const interval = setInterval(callback, intervalMilliSecond);
		this.schedulerRegistry.addInterval(name, interval);
	}

	deleteCheckInterval(name: string) {
		this.schedulerRegistry.deleteInterval(name);
		this.logger.warn(`Interval ${name} deleted!`);
	}
}
