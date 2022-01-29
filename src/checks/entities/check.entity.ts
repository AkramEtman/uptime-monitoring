import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';

import { CheckStatus, ProtocolType } from '../utils/enums'

export type CheckDocument = Check & mongoose.Document;

class CheckAuthentication {
  @Prop({ required: true })
  uesrname: string;

  @Prop({ required: true })
  password: string;  
}

class CheckAssert {

  @Prop({ required: true })
  statusCode: number;
}

class CheckHeader {

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;

}

@Schema()
export class Check {
  
  @Prop({ 
    required: true
  })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ enum: ProtocolType, required: true })
  protocol: string;

  @Prop()
  path?: string;

  @Prop()
  webhook?: string;

  @Prop({ 
    min: 1,
    default:5
  })
  timeout?: number; //seconds

  @Prop({ 
    min: 1,
    default:600
  })
  interval?: number; //seconds

  @Prop({
    min: 1,
    default: 1
  })
  threshold?: number;

  @Prop()
  authentication?: CheckAuthentication

  @Prop([CheckHeader])
  httpHeaders?: CheckHeader[]
  
  @Prop()
  assert?:CheckAssert

  @Prop([String])
  tags?: string[];

  @Prop()
  ignoreSSL?: boolean;

  @Prop({
    default: true
  })
  active?: boolean;

  @Prop({
    default: Date.now
  })
  createdAt?: Date

  
  @Prop({ 
		type: mongoose.Types.ObjectId,
		ref: 'User', 
		required: true 
	})
  user?: mongoose.Types.ObjectId;


  @Prop({ 
    enum: CheckStatus,
    default: CheckStatus.INITIAL
  })
  status?: string;

  @Prop({ 
    min: 0,
    default:0
  })
  uptimeCount?: number;

  
  @Prop({ 
    min: 0,
    default:0
  })
  downtimeCount?:number //outages

  @Prop({ 
    min: 0,
    default:0
  })
  uptime?: number;

  @Prop({ 
    min: 0,
    default:0
  })
  downtime?: number;

  @Prop({ 
    min: 0,
    default:0
  })
  responseTime?: number;

  @Prop()
  lastUpTime?: Date
}

export const CheckSchema = SchemaFactory.createForClass(Check);