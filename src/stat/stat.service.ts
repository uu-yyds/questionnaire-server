import { Injectable } from '@nestjs/common';
import { AnswerService } from 'src/answer/answer.service';
import { QuestionService } from 'src/question/question.service';
import { Question } from 'src/question/schemas/question.schema';
import { CheckboxPropsDto, RadioPropsDto, AnswerDto } from './dto/stat.dto';

@Injectable()
export class StatService {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService
  ) {}

  /**
   * 获取单选选项文本
   * @param value 选项值
   * @param props 选项属性
   * @returns 选项文本
   */
  private _getRadioOptText(value: string[], props: RadioPropsDto) {
    return props?.options?.find(option => value.includes(option.value))?.label;
  }

  /**
   * 获取多选选项文本
   * @param value 选项值
   * @param props 选项属性
   * @returns 选项文本
   */
  private _getCheckboxOptText(value: string, props: CheckboxPropsDto) {
    return value
      .split(',')
      .map(v => props?.list?.find(option => option.value === v)?.label)
      .join(',');
  }

  /**
   * 获取问卷统计信息
   * @param question 问卷
   * @param answer 答卷
   * @returns 统计信息
   */
  private _getAnswersInfo(question: Question, answer: AnswerDto) {
    const res = {};
    const { componentsList = [] } = question;
    const { answer_list = [] } = answer;
    answer_list.forEach(answer => {
      const { componentFeId, value } = answer;
      const component = componentsList.find(component => component.fe_id === componentFeId);
      if (component) {
        const { type, props = {} } = component;
        if (type === 'questionRadio') {
          // 单选
          res[componentFeId] = this._getRadioOptText(
            value && Array.isArray(value) ? value : [value],
            props as RadioPropsDto
          );
        } else if (type === 'questionCheckbox') {
          // 多选
          res[componentFeId] = this._getCheckboxOptText(value, props as CheckboxPropsDto);
        } else {
          // 其他组件
          res[componentFeId] = value?.toString();
        }
      }
    });
    return res;
  }

  /**
   * 获取答卷列表
   * @param questionId 问卷ID
   * @param options 选项
   * @returns 答卷列表
   * {
   *  count: number,
   *  list: {
   *    id: string;
   *    [componentFeId: string]: string;
   *  }[]
   * }
   */
  async getAnswerList(questionId: string, options?: { page: number; limit: number }) {
    const nullData = {
      count: 0,
      list: [],
    };
    if (!questionId) return nullData;
    const question = await this.questionService.findQuestionById(questionId);
    if (!question) return nullData;
    const count = await this.answerService.countAnswer(questionId);
    if (!count) return nullData;
    const answerList = await this.answerService.getAnswerList(questionId, options);

    const stat = {
      count,
      list: answerList.map(answer => {
        return {
          id: answer._id,
          ...this._getAnswersInfo(question, answer),
        };
      }),
    };
    return stat;
  }

  /**
   * 获取单个组件的统计信息
   * @param questionId 问卷ID
   * @param componentFeId 组件ID
   * @returns 组件统计信息
   * {
   *  data: {
   *    name: string;
   *    count: number;
   *  }[]
   * }
   */
  async getComponentStat(questionId: string, componentFeId: string) {
    if (!questionId || !componentFeId) return [];
    //   获取问卷
    const question = await this.questionService.findQuestionById(questionId);
    if (!question) return [];
    //   获取组件
    const { componentsList = [] } = question;
    const component = componentsList.find(component => component.fe_id === componentFeId);
    if (!component) return [];
    const { type, props = {} } = component;
    if (type !== 'questionRadio' && type !== 'questionCheckbox') {
      return [];
    }
    // 获取答卷
    const count = await this.answerService.countAnswer(questionId);
    if (!count) return [];
    // 获取答卷的统计信息
    const answerList = await this.answerService.getAnswerList(questionId, {
      page: 1,
      limit: count,
    });
    // 统计每个选项的答卷数量
    const stat = {};
    answerList.forEach(answer => {
      const { answer_list = [] } = answer;
      answer_list.forEach(answer => {
        if (answer.componentFeId !== componentFeId) return;
        if (Array.isArray(answer.value)) {
          answer.value.forEach(v => {
            if (stat[v] == null) stat[v] = 0;
            stat[v]++;
          });
        } else {
          if (stat[answer.value] == null) stat[answer.value] = 0;
          stat[answer.value]++;
        }
      });
    });
    // 返回统计信息
    const list: { name: string; count: number }[] = [];
    for (const val in stat) {
      let text = '';
      if (type === 'questionRadio') {
        text =
          this._getRadioOptText(val && Array.isArray(val) ? val : [val], props as RadioPropsDto) ||
          '';
      }
      if (type === 'questionCheckbox') {
        text = this._getCheckboxOptText(val, props as CheckboxPropsDto);
      }
      list.push({
        name: text,
        count: stat[val],
      });
    }
    return list;
  }
}
