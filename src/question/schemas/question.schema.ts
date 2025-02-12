import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({
  timestamps: true, // 自动添加创建时间和更新时间
})
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  js: string;

  @Prop()
  css: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isStar: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Object, required: true })
  author: {
    username: string;
    nickname: string;
  };

  @Prop({ type: Object, required: true })
  componentsList: {
    fe_id: string; // 前端控制
    type: string; // 组件类型
    name: string; // 组件名称
    title: string; // 组件标题
    isHidden: boolean; // 是否隐藏
    isDisabled: boolean; // 是否禁用
    isLocked: boolean; // 是否锁定
    props: Record<string, any>; // 组件属性
  }[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
