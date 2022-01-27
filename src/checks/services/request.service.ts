import { Injectable } from '@nestjs/common';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

axios.interceptors.request.use(function (config:any) {
 
	config.metadata = { startTime: new Date()}
	return config;
}, function (error) {
	return Promise.reject(error);
});

axios.interceptors.response.use(function (response:any) {
 
	response.config.metadata.endTime = new Date()
	response.duration = response.config.metadata.endTime - response.config.metadata.startTime
	return response;
}, function (error) {
	error.config.metadata.endTime = new Date();
	error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
	return Promise.reject(error);
});
@Injectable()
export class RequestService {

	
	async sendRequest(requestConfig: AxiosRequestConfig){
		return axios.request( requestConfig )
			.then((response:any)=>{
				return response 
			})
			.catch(err=>{return err})
	}

}
