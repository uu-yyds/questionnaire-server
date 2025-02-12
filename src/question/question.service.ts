import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DeleteResult } from 'mongoose';
import { Question } from './schemas/question.schema';
import { QuestionDto, QuestionListDto } from './dto/question.dto';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

@Injectable()
export class QuestionService {
  constructor(
    // 使用 @InjectModel 注入 Question 模型
    @InjectModel(Question.name) private readonly questionModel: Model<Question>
  ) {}

  async createQuestion(
    questionInfo?: QuestionDto,
    username?: string,
    nickname?: string
  ): Promise<Question> {
    const { title, description, componentsList } = questionInfo || {};
    const createdQuestion = new this.questionModel({
      title: title || `标题${new Date().getTime()}`,
      description: description || '',
      author: {
        username,
        nickname,
      },
      componentsList: componentsList || [
        {
          fe_id: nanoid(),
          type: 'questionInfo',
          title: '问卷信息',
          isHidden: false,
          isDisabled: false,
          isLocked: false,
          props: {
            title: '问卷标题',
            description: '问卷描述',
            author: {
              username,
              nickname,
            },
          },
        },
      ],
    });
    return createdQuestion.save();
  }

  async findQuestionById(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async deleteQuestionById(id: string, username: string, nickname: string): Promise<Question> {
    const question = await this.questionModel.findOneAndDelete({
      _id: id,
      author: { username, nickname },
    });
    if (!question) {
      throw new NotFoundException('问卷不存在');
    }
    if (question.author.username !== username || question.author.nickname !== nickname) {
      throw new ForbiddenException('你无权限删除该问卷');
    }
    return question;
  }

  async findAllQuestionsList({
    keyword = '',
    page = 1,
    pageSize = 10,
    isDeleted = false,
    isStar = false,
    author,
  }: QuestionListDto): Promise<Question[]> {
    const skip = (page - 1) * pageSize;
    return this.questionModel
      .find({
        $or: [
          // 模糊搜索
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
        isDeleted,
        isStar,
        author,
      })
      .sort({ _id: -1 }) // 按 id 降序排序
      .skip(skip)
      .limit(pageSize);
  }

  async findAllQuestionsListCount({
    keyword = '',
    isDeleted = false,
    isStar = false,
    author,
  }: QuestionListDto): Promise<number> {
    return this.questionModel.countDocuments({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
      isDeleted,
      isStar,
      author,
    });
  }

  async updateQuestionById(
    id: string,
    question: QuestionDto,
    username: string,
    nickname: string
  ): Promise<Question> {
    const updatedQuestion = await this.questionModel.findOneAndUpdate(
      { _id: id, author: { username, nickname } },
      question
    );
    if (!updatedQuestion) {
      throw new NotFoundException('Question not found');
    }
    return updatedQuestion;
  }

  async deleteManyQuestions(
    ids: string[],
    username: string,
    nickname: string
  ): Promise<DeleteResult> {
    const questions = await this.questionModel.deleteMany({
      _id: { $in: ids },
      author: { username, nickname },
    });
    return questions;
  }

  async duplicateQuestion(id: string, username: string, nickname: string): Promise<Question> {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new NotFoundException('问卷不存在');
    }
    const newQuestion = new this.questionModel({
      ...question.toObject(),
      _id: new mongoose.Types.ObjectId(),
      title: `${question.title}（复制）`,
      author: { username, nickname },
      isPublished: false,
      isStar: false,
      componentsList: question.componentsList.map(component => ({
        ...component,
        fe_id: nanoid(),
      })),
    });
    return newQuestion.save();
  }
}
