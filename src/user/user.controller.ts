import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  Redirect,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { Public } from 'src/auth/decorators/public.decorator';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsersList();
  }

  @Public()
  @Post('/login')
  @Redirect('/api/auth/login', 307) // POST 307是临时重定向 308是永久重定向
  login() {
    return;
  }

  @Public()
  @Post('register')
  async register(@Body() userInfo: User): Promise<User> {
    try {
      return await this.userService.createUser(userInfo);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('info')
  @Redirect('/api/auth/profile', 302) // GET301是永久重定向, 302是临时重定向
  info() {
    return;
  }

  @Get('info/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById(id);
  }
}
