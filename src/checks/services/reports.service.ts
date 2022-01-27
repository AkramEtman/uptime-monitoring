import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ITokenPayload } from 'src/users/dto/user-token-Payload';
import { Check, CheckDocument } from '../entities/check.entity';
import { CheckStatus } from '../utils/enums';

@Injectable()
export class ReportsService {

	constructor(
		@InjectModel(Check.name) private readonly checkModel: mongoose.Model<CheckDocument>,
	){}

	getReportByTag(tag:string,user:ITokenPayload){
		return this.generateReport( { 
			user: new mongoose.Types.ObjectId(user._id),
			tags: tag,
		})
	}
	
	async getReportById(id:string,user:ITokenPayload){
		const reports = await this.generateReport( { 
			user: new mongoose.Types.ObjectId(user._id),
			_id: new mongoose.Types.ObjectId( id ),
		})
		console.log( "user._id",user._id )

		console.log( "reports",reports )
		return reports[0]
	}

	generateReport( query:any ){
		return this.checkModel.aggregate([
			{
				$match: query
			},
			{
				$lookup:{
				  from: "checkhistories",
					let: { checkId: "$_id"},
					pipeline: [
						{ $match:
							{ $expr:
								{ $eq: [ "$check",  "$$checkId" ] },
							}
						},
						{ $sort : { _id : -1 } },
						{ $limit: 10 },
						{ 
							$project: {  
								_id: 0, 
								response: 1,
								status:1,
								createdAt:1 
							} 
						}
					],
					as: "history"
				}
			},
			{
				$project:{
					status: 1,
					availability:{ 
						$cond: [ 
							{ $eq: [ "$status", CheckStatus.INITIAL ] },
							0, 
							{ $divide: [ "$uptimeCount", { $add: [ "$uptimeCount", "$downtimeCount" ]} ] } 
						] 
					},
					outages: "$downtimeCount",
					downtime: 1,
					uptime: 1,
					responseTime: { 
						$cond: [ 
							{ $eq: [ "$status", CheckStatus.INITIAL ] },
							0, 
							{ $divide: [ "$responseTime", { $add: [ "$uptimeCount", "$downtimeCount" ]} ] } 
						] 
					},
					history:1
				}
			}
		]).exec()
	}
}
