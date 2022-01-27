import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    let user:User = await this.usersService.findOneByEmail(email);
    let isValid = await this.verifyPassword(plainTextPassword, user.password);

    if( isValid){
      delete user.password
      return user;
    }
    
    return null;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) { return false }
    return true
  }

  async login(user: any) {
    const payload = {_id:user._id, username: user.username, email: user.email, notification: user.notification ,sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
