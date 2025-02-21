import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({
  timestamps: true, // 自动添加创建时间和更新时间
})
export class Answer {
  @Prop({ required: true })
  questionId: string;

  @Prop()
  answer_list: {
    componentFeId: string; // 组件的feId
    value: string[]; // 组件的值
  }[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
