import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './schemas/answer.schema';
import { AnswerDto } from 'src/stat/dto/stat.dto';

@Injectable()
export class AnswerService {
  constructor(@InjectModel(Answer.name) private readonly answerModel: Model<Answer>) {}

  async createAnswer(answer: Answer): Promise<Answer> {
    if (!answer?.questionId) {
      throw new BadRequestException('缺少问卷ID');
    }
    return this.answerModel.create(answer);
  }

  async getAnswerList(
    questionId: string,
    options?: { page: number; limit: number }
  ): Promise<AnswerDto[]> {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;
    const answerList = await this.answerModel
      .find({ questionId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    if (!answerList.length) {
      throw new NotFoundException('暂无答卷');
    }
    return answerList.map(answer => ({
      _id: answer._id.toString(),
      questionId: answer.questionId,
      answer_list: answer.answer_list.map(item => ({
        componentFeId: item.componentFeId,
        value: Array.isArray(item.value) ? item.value.join(',') : item.value,
      })),
    }));
  }

  async countAnswer(questionId: string): Promise<number> {
    if (!questionId) {
      throw new BadRequestException('缺少问卷ID');
    }
    const answer = await this.answerModel.countDocuments({ questionId });
    return answer;
  }
}
