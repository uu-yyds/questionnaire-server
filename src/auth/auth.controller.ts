import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/schemas/user.schema';
import { LoginResponseDto } from 'src/user/dto/user.dto';
// import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() userInfo: User): Promise<LoginResponseDto> {
    return this.authService.login(userInfo);
  }

  //   @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user._doc;
  }
}
