import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { Public } from 'src/decorators/publicPath';
import { RefreshTokenGuard } from './refreshToken.guard';

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
  @Post('signin')
  signIn(@Body() signInDto: SignInUserDto) {
    try {
      return this.authService.signIn(signInDto);
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Get('refresh/:id')
  refreshTokens(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers() headers,
  ) {
    try {
      const [type, refreshToken] = headers.authorization?.split(' ') ?? [];
      return type === 'Bearer'
        ? this.authService.refreshTokens(id, refreshToken)
        : this.authService.refreshTokens(id, undefined);
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
