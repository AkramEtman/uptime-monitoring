import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { TasksService } from './tasks.service';
import { CreateCheckDto } from '../dto/create-check.dto';
import { UpdateCheckDto } from '../dto/update-check.dto';
import { Check, CheckDocument } from '../entities/check.entity';

@Injectable()
export class ChecksService implements OnApplicationBootstrap {

  constructor(
    @InjectModel(Check.name) private readonly checkModel: mongoose.Model<CheckDocument>,
    private readonly taskService:TasksService,
  ) {}

  onApplicationBootstrap() {
    this.init()
  }

  async init(){
    let checks = await this.getActiveChecks()
    for( let check of checks ){
      this.addCheckInterval(check)
    }
  }

  async create(createCheckDto: CreateCheckDto): Promise<Check> {
    createCheckDto.user = new mongoose.Types.ObjectId( createCheckDto.user )
    let createdCheck:Check = await this.checkModel.create(createCheckDto);
    if(createdCheck.active){ this.addCheckInterval( createdCheck ) }
    return createdCheck;
  }

  async findAll(query:any): Promise<Check[]> {
    return await this.checkModel.find({ user: query.user }).exec();
  }

  async findOne(query:any) {
    return await this.checkModel.findOne({
      user: new mongoose.Types.ObjectId(query.user),
      _id: new mongoose.Types.ObjectId(query.id)
    }).exec();
  }

  async update(query:any, updateCheckDto: UpdateCheckDto) {
    const updatedCheck = await this.checkModel.findOneAndUpdate({
        user: new mongoose.Types.ObjectId(query.user),
        _id: new mongoose.Types.ObjectId(query.id)
      }, updateCheckDto,
      { returnDocument: 'after' }
    );
    if (!updatedCheck) {throw new NotFoundException(); }
    
    this.deleteCheckInterval(updatedCheck)
    if(updatedCheck.active){ this.addCheckInterval( updatedCheck ) }
    return updatedCheck;
  }

  async remove(query:any) {
    const check = await this.checkModel.findOneAndDelete({
      user: new mongoose.Types.ObjectId(query.user),
      _id: new mongoose.Types.ObjectId(query.id)
    });
  
    if (!check) {
      throw new NotFoundException();
    }  
    this.deleteCheckInterval(check)
  }

  async updateReport(id: string, updateCheckReportDto: any) {
    return await this.checkModel.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(id)
      }, updateCheckReportDto,
      { returnDocument: 'after' }
    );
  }

  private getActiveChecks(){
    return this.checkModel.find({ active: true }).exec()
  }

  addCheckInterval( check:Check ){
    const checkIntervalName = this.buildCheckIntervalName( check )
    this.taskService.addCheckInterval( checkIntervalName, check ) 
  }

  deleteCheckInterval( check:Check ){
    const checkIntervalName = this.buildCheckIntervalName( check )
    this.taskService.deleteCheckInterval( checkIntervalName )
  }

  private buildCheckIntervalName( check:Check ){
    return check.user.toString() + ":" + check.name
  }
}