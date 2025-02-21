import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { AnswerModule } from 'src/answer/answer.module';
import { QuestionModule } from 'src/question/question.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from 'src/answer/schemas/answer.schema';

@Module({
  imports: [AnswerModule, QuestionModule],
  providers: [StatService],
  controllers: [StatController],
})
export class StatModule {}
