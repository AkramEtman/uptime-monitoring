import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsIn, IsOptional } from 'class-validator';
import { NotificationType } from 'src/notifications/utils/enums';

export class CreateUserDto {
  
  @ApiProperty({ 
    required: true,
    example: "user1"
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;
  
  @ApiProperty({ 
    required: true,
    example: "akrametman@gmail.com"
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ 
    required: true,
    example: "123456"
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ 
    enum: NotificationType,
    default: NotificationType.EMAIL,
    example: NotificationType.EMAIL,
    required: false
  })
  @IsOptional()
  @IsIn( Object.values( NotificationType ) )
  readonly notification?: string;

}