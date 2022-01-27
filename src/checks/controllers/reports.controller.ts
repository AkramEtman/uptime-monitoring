import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReportsService } from '../services/reports.service';
import { User } from '../../users/decorators/user.decorator';
import { ITokenPayload } from 'src/users/dto/user-token-Payload';
import { ReportDto } from '../dto/report.dto';

@ApiBearerAuth()
@ApiTags('reports')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiResponse( { type: [ReportDto] } )
  @Get("/tag/:tag")
  getReportByTag(@Param('tag') tag: string, @User()user:ITokenPayload) {
    return this.reportsService.getReportByTag(tag, user);
  }

  
  @ApiResponse( { type: ReportDto } )
  @Get('/check/:id')
  getReportById(@Param('id') id: string, @User()user:ITokenPayload) {
    return this.reportsService.getReportById(id,user);
  }

}
