import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Check } from './check.entity';
import { CheckStatus } from '../utils/enums'
import { User } from '../../users/entities/user.entity';

export type CheckHistoryDocument = CheckHistory & mongoose.Document;

class CheckResponse {
  @Prop()
  time: number;  

  @Prop()
  status: number;  
}

@Schema()
export class CheckHistory {
  
  @Prop({ required: true })
  status: CheckStatus;

  @Prop({ 
		type: mongoose.Types.ObjectId,
		ref: 'Check', 
		required: true 
	})
  check: mongoose.Types.ObjectId;

  @Prop({ 
		type: mongoose.Types.ObjectId,
		ref: 'User', 
		required: true 
	})
  user: mongoose.Types.ObjectId;

  @Prop()
  response: CheckResponse

	@Prop({
    default: Date.now
  })
  createdAt: Date
}

export const CheckHistorySchema = SchemaFactory.createForClass(CheckHistory);