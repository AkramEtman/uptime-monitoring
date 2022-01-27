import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { IsString, IsOptional, IsInt, IsIn, Min, Max, IsBoolean, ValidateNested, IsArray, IsNotEmpty, IsMongoId } from 'class-validator';
import { ProtocolType } from '../utils/enums';

class CheckHeaderDto {

  @ApiProperty({ 
    required: true,
    example: "key1"
  })
  @IsString()
  readonly key: string;

  @ApiProperty({ 
    required: true, 
    example: "value1"
  })
  @IsString()
  readonly value: string;
}

class CheckAssertDto {

  @ApiProperty({ 
    required: true, 
    example: 200
  })
  @IsInt()
  readonly statusCode: number;
}

class CheckAuthenticationDto {

  @ApiProperty({ 
    required: true,
    example: "user1"
  })
  @IsString()
  readonly username: string;

  @ApiProperty({ 
    required: true, 
    example: "pass"
  })
  @IsString()
  readonly password: string;
}

export class CreateCheckDto {
  
  @ApiProperty({ 
    required: true,
    example: "Amazon"
  })
  @IsString()
  readonly name: string;
  

  @ApiProperty({ 
    required: true,
    example: "www.amazon.eg"
  })
  @IsString()
  readonly url: string;


  @ApiProperty({ 
    enum: ProtocolType, 
    required: true,
    example: ProtocolType.HTTPS
  })
  @IsIn( Object.values(ProtocolType) )
  readonly protocol: string;

  user: mongoose.Types.ObjectId


  @ApiProperty({ 
    example: "deals"
  })
  @IsOptional()
  @IsString()
  readonly path?: string;


  @ApiProperty({ 
    example: "localhost:3000"
  })
  @IsOptional()
  @IsString()
  readonly webhook?: string;

  
  @ApiProperty({ 
    description: 'The timeout of the polling request in seconds',
    default: 5
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly timeout?: number;

  
  @ApiProperty({ 
    description: 'The time interval for polling requests seconds',
    default: 600
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly interval?: number;

  
  @ApiProperty({
    description: 'The threshold of failed requests that will create an alert',
    default: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly threshold?: number;

  
  @ApiProperty({ type: CheckAuthenticationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CheckAuthenticationDto)
  readonly authentication?: CheckAuthenticationDto

  
  @ApiProperty({ type: [CheckHeaderDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CheckHeaderDto)
  readonly httpHeaders?: CheckHeaderDto[]
  
  
  @ApiProperty({ type: CheckAssertDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CheckAssertDto)
  readonly assert?: CheckAssertDto

  
  @ApiProperty({ 
    type:[String], 
    isArray: true,
    example: ["offers"]
  })
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  @IsNotEmpty({each: true})
  readonly tags?: string[];

  
  @ApiProperty({
    example: true
  })
  @IsOptional()
  @IsBoolean()
  readonly ignoreSSL?: boolean;

  
  @ApiProperty({
    example: true,
    description: 'flag to pause check or not',
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}