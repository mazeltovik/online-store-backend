import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/decorators/publicPath';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('signup')
  signUp(@Body() signUpDto: CreateUserDto) {
    try {
      return this.authService.signUp(signUpDto);
    } catch (err) {
      throw err;
    }
  }
  @Public()
  @HttpCode(200)
  @Get('signup')
  getUser() {
    try {
      return this.authService.getUser();
    } catch (err) {
      throw err;
    }
  }
}
