import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import {
  LoginResponseDto,
  LOGIN_SUCCESS_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
} from 'src/user/dto/user.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(userInfo: User): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByUsername(userInfo.username);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
    }
    // 解密password
    const password = crypto.createHash('sha256').update(userInfo.password).digest('hex');
    if (user.password !== password) {
      throw new NotFoundException(PASSWORD_ERROR_MESSAGE);
    }
    return {
      message: LOGIN_SUCCESS_MESSAGE,
      result: {
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        access_token: this.jwtService.sign({ ...user }),
      },
    };
  }
}
