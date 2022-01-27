import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { ChecksService } from './services/checks.service';
import { ChecksController } from './controllers/checks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Check, CheckSchema } from './entities/check.entity';
import { TasksService } from './services/tasks.service';
import { CheckProcessor } from './services/checks.processor';
import { RequestService } from './services/request.service';
import { CheckJobService } from './services/check-job.service';
import { CheckHistory, CheckHistorySchema } from './entities/check-history.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Check.name, schema: CheckSchema },
      { name: CheckHistory.name, schema: CheckHistorySchema }
    ]),
    BullModule.registerQueue({
      name: 'checks',
      defaultJobOptions: { 
        removeOnComplete: true,
        removeOnFail: true
      }
    }),
    NotificationsModule
  ],
  controllers: [ChecksController,ReportsController],
  providers: [ChecksService,TasksService,CheckProcessor,CheckJobService,RequestService,ReportsService]
})
export class ChecksModule {}