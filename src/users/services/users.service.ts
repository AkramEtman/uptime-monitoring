import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../entities/user.entity';


@Injectable()
export class UsersService {

  SALT_Rounds = 10;

  constructor(
    @InjectModel(User.name) private readonly userModel: mongoose.Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email, username, notification } =createUserDto;
    const hashedPassword = await bcrypt.hash(password, this.SALT_Rounds);
    await this.userModel.create({
      email: email?.trim().toLowerCase(),
      username: username.trim(),
      password: hashedPassword,
      notification 
    }).then( (user:User) =>{
      user.password = undefined
      return user  
    }).catch((err)=>{
      throw new BadRequestException("please use anthor value for "+ Object.keys(err.keyValue))
    })
  }

  async findOneByEmail(email:string){
    const user =  await this.userModel.findOne({
      email: email
    }).exec();
    if( !user ){ throw new NotFoundException() }
    return user
  }

  async findOne(id:string){
    const user =  await this.userModel.findOne({
      id: new mongoose.Types.ObjectId(id)
    }).exec();
    if( !user ){ throw new NotFoundException() }
    return user
  }

}
