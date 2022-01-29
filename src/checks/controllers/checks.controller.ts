import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ChecksService } from '../services/checks.service';
import { CreateCheckDto } from '../dto/create-check.dto';
import { UpdateCheckDto } from '../dto/update-check.dto';
import { User } from '../../users/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ITokenPayload } from '../../users/dto/user-token-Payload';

@ApiBearerAuth()
@ApiTags('checks')
@UseGuards(JwtAuthGuard)
@Controller('checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Post()
  create(@Body() createCheckDto: CreateCheckDto, @User()user:ITokenPayload) {
    createCheckDto.user = user._id
    return this.checksService.create(createCheckDto);
  }

  @Get()
  findAll( @User()user:ITokenPayload ) {
    return this.checksService.findAll({user:user._id});
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User()user:ITokenPayload) {
    return this.checksService.findOne({id,user:user._id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto,@User()user:ITokenPayload) {
    let query = { id: id, user: user._id }
    return this.checksService.update(query, updateCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User()user:ITokenPayload) {
    return this.checksService.remove({id,user:user._id});
  }
}
