import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { Check } from '../../checks/entities/check.entity';
import { NotificationStrategy } from '../interfaces/notification.interface';
 
@Injectable()
export class EmailService implements NotificationStrategy{
  private nodemailerTransport: Mail;
 
  constructor(
    private readonly configService: ConfigService
  ) {
    this.nodemailerTransport = createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
 
  run(user: User, check: Check): void {
    this.sendMail({
      to: user.email,
      subject: check.name + " Check is " + check.status,
      text: check.name + " is " + check.status
    })
  }

  sendMail(options: Mail.Options) {
    this.nodemailerTransport.sendMail(options)
  }

}