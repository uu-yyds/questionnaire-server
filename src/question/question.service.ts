import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService {
  getAllQuestion(page: number, limit: number): any {
    console.log(page, limit);
    return {
      count: 2,
      list: [
        {
          id: 1,
          title: '问题1',
        },
        {
          id: 2,
          title: '问题2',
        },
      ],
    };
  }
}
