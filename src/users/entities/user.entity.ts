import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NotificationType } from '../../notifications/utils/enums';


export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  
  @Prop({ required: true })
  username: string;

  @Prop({  
		required: true,
    unique: true 
	})
  email: string;

	@Prop({  
		required: true 
	})
  password: string;

  @Prop({
		default: NotificationType.EMAIL,
    enum: NotificationType
	})
  notification: string;

	@Prop({
    default: Date.now
  })
  createdAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User);