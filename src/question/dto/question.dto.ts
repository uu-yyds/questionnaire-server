export class QuestionDto {
  readonly title: string;
  readonly description: string;
  readonly componentsList: {
    fe_id: string;
    type: string;
    title: string;
    isHidden: boolean;
    isDisabled: boolean;
    isLocked: boolean;
    props: Record<string, any>;
  }[];
}

export class QuestionListDto {
  readonly keyword: string;
  readonly page?: number;
  readonly pageSize?: number;
  readonly isDeleted?: boolean;
  readonly isStar?: boolean;
  readonly author?: {
    username: string;
    nickname: string;
  };
}

export class QuestionAllListDto {
  readonly list: QuestionDto[];
  readonly total: number;
}
