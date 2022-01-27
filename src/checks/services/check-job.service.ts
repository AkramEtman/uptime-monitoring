import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import { CheckAssertDto, CheckHeaderDto, CheckRequestDto } from '../dto/check-request.dto';
import { CheckHistory, CheckHistoryDocument } from '../entities/check-history.entity';
import { ProtocolType,CheckStatus } from '../utils/enums';
import { ChecksService } from './checks.service';
import { RequestService } from './request.service';
import { Check, CheckDocument } from '../entities/check.entity';
import { ITokenPayload } from 'src/users/dto/user-token-Payload';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class CheckJobService {

	private readonly logger = new Logger(CheckJobService.name);

	constructor(
		@InjectModel(CheckHistory.name) private readonly checkHistoryModel: mongoose.Model<CheckHistoryDocument>,
		private readonly checksService:ChecksService,
		private readonly requestService:RequestService,
		private readonly notificationsService:NotificationsService
	){}

  async handleCheckJob( checkRequestDto: CheckRequestDto ){
		const checkResponse = await this.sendCheckRequest( checkRequestDto )
		const checkStatus:CheckStatus = this.getCheckStatus( checkRequestDto.assert, checkResponse )


		this.logger.log("check response",{ 
			check: checkRequestDto._id,
			checkStatus
		})

		const checkHistory = await this.checkHistoryModel.create({
			check: new mongoose.Types.ObjectId(checkRequestDto._id),
			user: new mongoose.Types.ObjectId(checkRequestDto.user),
			status: checkStatus,
			response:{
				time: checkResponse.duration / 1000,
				status: checkResponse.status
			}
		})

		const oldCheck = await this.checksService.findOne( {id:checkRequestDto._id, user: checkRequestDto.user} )
		const neededCheckUpdate = this.buildCheckUpdates( checkHistory, oldCheck)
		const check = await this.checksService.updateReport( checkRequestDto._id, neededCheckUpdate )

		const lastCheckStatus = oldCheck.status

		const isStatusChanged = !(checkStatus === lastCheckStatus)
		this.manageNotification( check, isStatusChanged )
		
	}
	
	async manageNotification( check:Check, isStatusChanged:boolean ){
		if( isStatusChanged ){ this.sendWebHook( check ) }
		if( isStatusChanged && check.status == CheckStatus.UP ){ 
			this.notificationsService.send( check )
		}
		if( check.status == CheckStatus.DOWN ){
			const failCheckCount = await this.findCheckFailsCount( check.lastUpTime )
			if( check.threshold <= failCheckCount ){
				this.notificationsService.send( check )
			}
		}
	}


	buildCheckUpdates( checkHistory:CheckHistory, oldCheck:Check ){
		let updates={};
		if( checkHistory.status == CheckStatus.UP ){
			const uptimeCount = ( oldCheck )? oldCheck.uptimeCount : 0;
			const uptime = ( oldCheck )? oldCheck.uptime : 0;
			updates[ "lastUpTime" ] = Date.now();
			updates[ "status" ] = CheckStatus.UP;
			updates[ "uptimeCount" ] = uptimeCount + 1;
			updates[ "uptime" ] = uptime + oldCheck.interval;
		}else if( checkHistory.status == CheckStatus.DOWN ){
		  const downtimeCount = ( oldCheck )? oldCheck.downtimeCount : 0;
			const downtime = ( oldCheck )? oldCheck.downtime : 0;
			updates[ "status" ] = CheckStatus.DOWN;
		  updates[ "downtimeCount" ] = downtimeCount + 1;
		  updates[ "downtime" ] = downtime + oldCheck.interval;
		}
		updates[ "responseTime" ] = oldCheck.responseTime + checkHistory.response.time
		return updates	
	}

	findCheckFailsCount( checkLastUpTime:Date ){
		return this.checkHistoryModel.countDocuments({
			createdAt : { $gte: checkLastUpTime }
		}).exec()
	}

	async sendWebHook( check:Check ){
		if( !check.webhook ){ return }
		const requestConfig:AxiosRequestConfig = {
			method: "POST",
			url: check.webhook,
			data:{
				check:{
					name: check.name,
					status: check.status
				}
			}
		}

		this.requestService.sendRequest( requestConfig );
	}

  async sendCheckRequest(checkRequestDto: CheckRequestDto){
		const fullURL = this.buildCheckUrl( checkRequestDto.protocol, checkRequestDto.url , checkRequestDto.path  )
		const requestConfig:AxiosRequestConfig = {
			method: "get",
			url: fullURL,
			headers: this.convertHeadersToObject( checkRequestDto.httpHeaders ),
			timeout: checkRequestDto.timeout * 1000,
			auth: checkRequestDto.authentication,
			insecureHTTPParser: checkRequestDto.ignoreSSL
		}
		this.logger.log("sending check request",{ check: checkRequestDto._id })
		return this.requestService.sendRequest( requestConfig )

	}

	buildCheckUrl( protocol:ProtocolType, url:string, path?:string ):string{
		let fullURL = protocol + "://" + url
		if( path ){ fullURL += "/" + path }
		return fullURL
	}

	convertHeadersToObject( headersArr:CheckHeaderDto[] ){
		let headersObject = {}
		for (let i = 0; i< headersArr.length; i++) {
			headersObject[ headersArr[i]["key"] ] = headersArr[i]["value"]
		}
		return headersObject;
	}

	getCheckStatus( checkAssert:CheckAssertDto, checkResponse:AxiosResponse ){
		const DEFAULT_STATUS_CODE = 200
		let status = CheckStatus.DOWN

		const statusCode = ( checkAssert && checkAssert.statusCode )?? DEFAULT_STATUS_CODE 
		if( statusCode == checkResponse.status ){ status = CheckStatus.UP }
		return status
	}
}
