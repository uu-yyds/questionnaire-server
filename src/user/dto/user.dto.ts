export class LoginResponseDto {
  message: string;
  result: {
    username: string;
    nickname: string;
    avatar: string;
    access_token: string;
  };
}

export class UserWithoutPasswordDto {
  username: string;
  nickname: string;
  avatar: string;
}

export const LOGIN_SUCCESS_MESSAGE = '登录成功!';
export const LOGIN_FAILED_MESSAGE = '登录失败!';
export const USER_NOT_FOUND_MESSAGE = '用户不存在!';
export const PASSWORD_ERROR_MESSAGE = '密码错误!';
