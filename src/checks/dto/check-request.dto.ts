import mongoose from 'mongoose';
import { ProtocolType } from '../utils/enums';

export class CheckHeaderDto {
  readonly key: string;
  readonly value: string;
}

export class CheckAssertDto {
  readonly statusCode: number;
}

class CheckAuthenticationDto {
  readonly username: string;
  readonly password: string;
}

export class CheckRequestDto {
  readonly _id:string
  readonly url: string;
  readonly status: string;
  readonly protocol: ProtocolType;
  readonly path: string;
  readonly timeout: number;
  readonly authentication: CheckAuthenticationDto
	readonly httpHeaders: CheckHeaderDto[]
  readonly assert: CheckAssertDto
  readonly ignoreSSL: boolean;
  readonly user: mongoose.Types.ObjectId
}