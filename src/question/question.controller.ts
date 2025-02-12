import { Controller, Get, Param, Delete, Post, Body, Patch, Query, Request } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionDto, QuestionListDto, QuestionAllListDto } from './dto/question.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async getAllQuestion(
    @Query() query: QuestionListDto,
    @Request() req: any
  ): Promise<QuestionAllListDto> {
    const { keyword, page, pageSize, isDeleted, isStar } = query;
    const { username, nickname } = req.user._doc;
    const total = await this.questionService.findAllQuestionsListCount({
      keyword,
      isDeleted: isDeleted || false,
      isStar: isStar || false,
      author: { username, nickname },
    });
    const list = await this.questionService.findAllQuestionsList({
      keyword,
      page,
      pageSize,
      isDeleted,
      isStar,
      author: { username, nickname },
    });
    return {
      list,
      total,
    };
  }

  @Get(':id')
  getQuestionById(@Param('id') id: string): any {
    return this.questionService.findQuestionById(id);
  }

  @Delete(':id')
  deleteQuestionById(@Param('id') id: string, @Request() req: any): any {
    const { username, nickname } = req.user._doc;
    return this.questionService.deleteQuestionById(id, username, nickname);
  }

  @Post('create')
  createQuestion(@Body() questionDto: QuestionDto, @Request() req: any): any {
    const { username, nickname } = req.user._doc;
    return this.questionService.createQuestion(questionDto, username, nickname);
  }

  @Patch(':id')
  updateQuestionById(
    @Param('id') id: string,
    @Body() questionDto: QuestionDto,
    @Request() req: any
  ): any {
    const { username, nickname } = req.user._doc;
    return this.questionService.updateQuestionById(id, questionDto, username, nickname);
  }

  @Delete('deleteMany')
  deleteManyQuestions(@Body() ids: string[], @Request() req: any): any {
    const { username, nickname } = req.user._doc;
    return this.questionService.deleteManyQuestions(ids, username, nickname);
  }

  @Post('duplicate/:id')
  duplicateQuestion(@Param('id') id: string, @Request() req: any): any {
    const { username, nickname } = req.user._doc;
    return this.questionService.duplicateQuestion(id, username, nickname);
  }
}
