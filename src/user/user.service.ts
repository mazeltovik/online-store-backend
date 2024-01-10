import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { v4 as uuidv4 } from 'uuid';

type Colors =
  | 'clr_ff0000'
  | 'clr_00ff00'
  | 'clr_0000ff'
  | 'clr_000'
  | 'clr_ffb900';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async getUserCart(id: string) {
    const cart = await this.prisma.cart.findMany({
      where: {
        userId: id,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            shipping: true,
          },
        },
      },
    });
    if (cart) {
      return cart;
    } else {
      throw new NotFoundException('Cart was not found.');
    }
  }

  async addToCart(id: string, { productId, amount, color }: AddItemToCartDto) {
    const isExist = await this.IsColorExist({ productId, amount, color });
    if (isExist) {
      const checkAmount = await this.checkAmount({ productId, amount, color });
      if (checkAmount) {
        return this.setAmount(id, { productId, amount, color });
      } else {
        throw new NotFoundException('Product doesnt contains this amount');
      }
    } else {
      throw new NotFoundException('Product or color doesnt exist');
    }
    // try {
    //   await this.prisma.user.update({
    //     where: { id },
    //     data: {
    //       cart: {
    //         create: [
    //           {
    //             id:uuidv4(),
    //             productId,
    //             amount,
    //             color
    //           },
    //         ],
    //       },
    //     },
    //   });
    //   this.updateColors({productId,amount,color})
    //   return { statusCode: 200, message: 'Product has been added to your cart' };
    // } catch{
    //   throw new NotFoundException('Cart was not found');
    // }
  }

  async IsColorExist({ productId, amount, color }: AddItemToCartDto) {
    const shouldUpdateColor = await this.prisma.color.findFirst({
      where: { productId },
    });
    return shouldUpdateColor && color in shouldUpdateColor ? true : false;
  }

  async checkAmount({ productId, amount, color }: AddItemToCartDto) {
    const product = await this.prisma.color.findFirst({
      where: { productId },
    });
    return product[color] >= amount ? true : false;
  }

  async setAmount(id: string, { productId, amount, color }: AddItemToCartDto) {
    await this.prisma.user
      .update({
        where: { id },
        data: {
          cart: {
            create: [
              {
                id: uuidv4(),
                productId,
                amount,
                color,
              },
            ],
          },
        },
      })
      .then(() => this.updateColors({ productId, amount, color }));
    return { statusCode: 200, message: 'Product has been added to your cart' };
  }

  async updateColors({ productId, amount, color }: AddItemToCartDto) {
    const shouldUpdateColor = await this.prisma.color.findFirst({
      where: { productId },
    });
    const obj = Object.fromEntries([
      [color, shouldUpdateColor[color] - amount],
    ]);
    await this.prisma.color.update({
      where: { productId },
      data: obj,
    });
  }

  async setColor(productId: string, amount: number) {
    try {
      await this.prisma.color.update({
        where: { productId },
        data: {
          clr_0000ff: amount,
        },
      });
    } catch {
      throw new ConflictException('You cant add more products, then exist');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
