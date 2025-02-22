import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Answer } from './schemas/answer.schema';
import { Public } from 'src/auth/decorators/public.decorator';
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Public()
  @Post('create')
  async createAnswer(@Body() answer: Answer) {
    return this.answerService.createAnswer(answer);
  }

  @Get('list/:questionId')
  async getAnswerList(@Param('questionId') questionId: string) {
    return this.answerService.getAnswerList(questionId);
  }
}
