import { Injectable } from '@nestjs/common';
import { Check } from '../../checks/entities/check.entity';
import { UsersService } from '../../users/services/users.service';
import { NotificationStrategy } from '../utils/enums';
import { NotificationContext } from './notificationContext.service';

@Injectable()
export class NotificationsService {

	constructor(
		private readonly usersService: UsersService,
	){}

	async send( check:Check ){
		const user =  await this.usersService.findOne( check.user.toString() )
		const NotificationStrategyService = NotificationStrategy[user.notification] 
		if( !NotificationStrategyService ){ throw "error"; }
		const context = new NotificationContext(new NotificationStrategyService());
		context.send( user, check );
	}    
}
