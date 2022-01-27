import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckJobService } from '../services/check-job.service';
import { ChecksService } from '../services/checks.service';
import { RequestService } from '../services/request.service';
import { CheckHistory } from '../entities/check-history.entity';
import { CheckStatus } from '../utils/enums';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { Check } from '../entities/check.entity';
import { mockedNotificationsService } from '../../notifications/tests/mocks/notifications.service';


describe('ChecksService', () => {
  let checkJobService: CheckJobService;
	let notificationsService: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
				CheckJobService,
				{
					provide: ChecksService,
					useValue: {}
				},
				{
					provide: RequestService,
					useValue: {}
				},
				{
					provide: NotificationsService,
					useValue: mockedNotificationsService
				},
				{
					provide: getModelToken(CheckHistory.name),
					useValue: {}
				}
			],
    }).compile();

    checkJobService = module.get<CheckJobService>(CheckJobService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(checkJobService).toBeDefined();
  });

	describe("manageNotification",()=>{
		let check:Check
		beforeEach( ()=>{
			check = { 
				url: "",
				protocol: "https",
				name:"",
				status: CheckStatus.UP,
				threshold: 15
			}

			checkJobService.sendWebHook = jest.fn()
			checkJobService.findCheckFailsCount =jest.fn().mockResolvedValue(10)
		})

		afterEach(() => {
			jest.clearAllMocks()
		});

		it('should call sendWebHook and notification because check status is changed and now is UP', async ()=>{
			const sendWebHookSpy = jest.spyOn(checkJobService, 'sendWebHook');
			// const findCheckFailsCountSpy = jest.spyOn(checkJobService, 'findCheckFailsCount');
			const sendNotificationsServiceSpy = jest.spyOn(notificationsService, 'send');
			const isStatusChanged = true;

			await checkJobService.manageNotification(check, isStatusChanged )
      expect(sendWebHookSpy).toBeCalledTimes(1);
      expect(sendNotificationsServiceSpy).toBeCalledTimes(1);
		})
		
		it('should call sendWebHook only because check status is changed and now is Down and threshold has not exceeded', async ()=>{
			const sendWebHookSpy = jest.spyOn(checkJobService, 'sendWebHook');
			const sendNotificationsServiceSpy = jest.spyOn(notificationsService, 'send');
			const isStatusChanged = true;
			check.status = CheckStatus.DOWN

			await checkJobService.manageNotification(check, isStatusChanged )
      expect(sendWebHookSpy).toBeCalledTimes(1);
      expect(sendNotificationsServiceSpy).toBeCalledTimes(0);
		})

		it('should call notification only because check status is not changed and now is Down and threshold has exceeded', async ()=>{
			const sendWebHookSpy = jest.spyOn(checkJobService, 'sendWebHook');
			const sendNotificationsServiceSpy = jest.spyOn(notificationsService, 'send');
			const isStatusChanged = false;
			check.status = CheckStatus.DOWN
			check.threshold = 5
			
			await checkJobService.manageNotification(check, isStatusChanged )
      expect(sendWebHookSpy).toBeCalledTimes(0);
      expect(sendNotificationsServiceSpy).toBeCalledTimes(1);
		})

		it('should not call because check status is not changed and now is Down and threshold has not exceeded', async ()=>{
			const sendWebHookSpy = jest.spyOn(checkJobService, 'sendWebHook');
			const sendNotificationsServiceSpy = jest.spyOn(notificationsService, 'send');
			const isStatusChanged = false;
			check.status = CheckStatus.DOWN
			
			await checkJobService.manageNotification(check, isStatusChanged )
      expect(sendWebHookSpy).toBeCalledTimes(0);
      expect(sendNotificationsServiceSpy).toBeCalledTimes(0);
		})

	})

	// describe('getCheckStatus',()=>{
		
	// 	it('should be return status Up with statusCode as input', () => {
	// 		const assert:CheckAssertDto = { statusCode: 302 }
	// 		const response:AxiosResponse = { status: 302,data: {},statusText: 'OK',headers: {},config: {}} 
	// 		expect(checkJobService.getCheckStatus( assert, response )).toEqual( CheckStatus.UP );
	// 	});
	
	// 	it('should be return status Up without statusCode as input', () => {
	// 		let assert:CheckAssertDto
	// 		const response:AxiosResponse = { status: 200,data: {},statusText: 'OK',headers: {},config: {}} 
	// 		expect(checkJobService.getCheckStatus( assert, response )).toEqual( CheckStatus.UP );
	// 	});

	// 	it('should be return status Down with statusCode as input', () => {
	// 		const assert:CheckAssertDto = { statusCode: 302 }
	// 		const response:AxiosResponse = { status: 200,data: {},statusText: 'OK',headers: {},config: {}} 
	// 		expect(checkJobService.getCheckStatus( assert, response )).toEqual( CheckStatus.DOWN );
	// 	});

	// 	it('should be return status Down with statusCode as input', () => {
	// 		let assert:CheckAssertDto
	// 		const response:AxiosResponse = { status: 302,data: {},statusText: 'OK',headers: {},config: {}} 
	// 		expect(checkJobService.getCheckStatus( assert, response )).toEqual( CheckStatus.DOWN );
	// 	});
	// })

	// describe('convertHeadersToObject',()=>{
		
	// 	it('should be return headers as object', () => {
	// 		const headersArr:CheckHeaderDto[] = [ 
	// 			{key:"header1",value:"val1"},
	// 			{key:"header2",value:"val2"}
	// 		]
	// 		const headersObject = { 
	// 			header1 : "val1",
	// 			header2 : "val2"
	// 		} 
	// 		expect(checkJobService.convertHeadersToObject( headersArr )).toEqual( headersObject );
	// 	});
	
	// })
});
