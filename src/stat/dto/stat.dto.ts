export interface CheckboxPropsDto {
  title: string;
  list: {
    value: string;
    label: string;
    checked: boolean;
  }[];
  isVertical: boolean;
}

export interface RadioPropsDto {
  title: string;
  options: {
    value: string;
    label: string;
  }[];
  isVertical: boolean;
  value: string;
}

export interface AnswerDto {
  _id: string;
  questionId: string;
  answer_list: {
    componentFeId: string;
    value: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
