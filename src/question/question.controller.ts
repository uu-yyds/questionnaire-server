import { Controller, Get, Query } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  getAllQuestion(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): any {
    return this.questionService.getAllQuestion(page, limit);
  }
}
