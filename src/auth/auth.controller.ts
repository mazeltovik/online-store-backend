import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
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
  @Get(':id')
  getUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.authService.getUser(id);
    } catch (err) {
      throw err;
    }
  }
}
