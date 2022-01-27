import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from './services/email.service';

@Module({
  imports:[ConfigModule,UsersModule],
  providers: [NotificationsService,EmailService],
  exports: [NotificationsService,EmailService]
})
export class NotificationsModule {}
