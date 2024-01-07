import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt';
// import { userWithoutPassword } from '../helpers/userWithoutPassword';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

const saltOrRounds = parseInt(process.env.CRYPT_SALT);

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signUp(signUpDto: CreateUserDto) {
    const { login, password, name } = signUpDto;
    const isLoginExist = await this.prisma.user.findFirst({ where: { login } });
    if (isLoginExist) {
      throw new ConflictException('Conflict. Login already exists');
    } else {
      const hash = await bcrypt.hash(password, saltOrRounds);
      const user = {
        id: uuidv4(),
        version: 1,
        login,
        name,
        password: hash,
      };
      await this.prisma.user.create({ data: user });
      return { statusCode: 200, message: 'User created' };
    }
  }
  async getUser() {
    const cart = await this.prisma.user.update({
      where: { id: 'd1cf2911-b9fc-4ac5-9e0d-5e6eac5430a1' },
      data: {
        cart: {
          create: [
            {
              productId: '3ee24ac7-a7f9-4409-8444-412e3932704d',
            },
          ],
        },
      },
    });
    const user = await this.prisma.user.findFirst({
      where: { id: 'd1cf2911-b9fc-4ac5-9e0d-5e6eac5430a1' },
      include: {
        cart: {
          select: {
            productId: true,
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
    return user;
  }
}
