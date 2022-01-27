import { ApiProperty } from '@nestjs/swagger';
import { CheckStatus } from '../utils/enums';

class Response{
  @ApiProperty({ 
    example: 0.801
	})
  readonly time: number;

	@ApiProperty({ 
    example: 200
	})
  readonly status: number;
}

class History{
	@ApiProperty({ 
    example: CheckStatus.UP,
		enum: CheckStatus,
		name:"status"
	})
  readonly statusResponse: string;

	@ApiProperty({ 
    type: Response,
		description : "Last 10 chech history log" 
	})
  readonly response: Response;

	@ApiProperty({ 
    example: Date.now()
	})
  readonly createdAt: Date;
}

export class ReportDto {
	
  @ApiProperty({ 
    example: CheckStatus.UP,
		enum: CheckStatus
	})
  readonly status: string;
  
  @ApiProperty({ 
    example: 80
	})
  readonly availability: number;

	@ApiProperty({ 
    example: 20
	})
  readonly outages: number;

	@ApiProperty({ 
    example: 0.482
	})
  readonly responseTime: number;

	@ApiProperty({ 
    type: [History],
		description : "Last 10 chech history log" 
	})
  readonly history: History[];

	@ApiProperty({ 
    example: 1201
	})
  readonly uptime: number;

	@ApiProperty({ 
    example: 248
	})
  readonly downtime: number;

}