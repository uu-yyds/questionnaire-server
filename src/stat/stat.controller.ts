import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatService } from './stat.service';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get('answer/:questionId')
  getAnswerList(
    @Param('questionId') questionId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.statService.getAnswerList(questionId, { page, limit });
  }

  @Get('component/:questionId/:componentFeId')
  getComponentStat(
    @Param('questionId') questionId: string,
    @Param('componentFeId') componentFeId: string
  ) {
    return this.statService.getComponentStat(questionId, componentFeId);
  }
}
