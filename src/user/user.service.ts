import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { v4 as uuidv4 } from 'uuid';
import { QueryKeys } from './entities/user.entity';
import { RemoveFromCartDto, RemovingItemDto } from './dto/remove-from-cart.dto';

type Cart = {
  id: string;
  userId: string;
  productId: string;
  color: string;
  amount: number;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserCart(id: string, { amount }: QueryKeys) {
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
            imageUrl: true,
            colors: true,
          },
        },
      },
    });
    if (cart) {
      return amount ? { amount: cart.length } : cart;
    } else {
      throw new NotFoundException('Cart was not found.');
    }
  }

  async addToCart(id: string, { productId, amount, color }: AddItemToCartDto) {
    const isExistUser = await this.checkExistingUser(id);
    if (isExistUser) {
      const isExist = await this.IsColorExist({ productId, color });
      if (isExist) {
        const checkAmount = await this.checkAmount({
          productId,
          amount,
          color,
        });
        if (checkAmount) {
          const existingCart = await this.isCartExist(id, {
            productId,
            color,
          });
          if (existingCart) {
            await this.updateExistingCart(existingCart, {
              productId,
              amount,
              color,
            });
          } else {
            return this.setAmount(id, { productId, amount, color });
          }
        } else {
          throw new NotFoundException('Product doesnt contains this amount');
        }
      } else {
        throw new NotFoundException('Product or color doesnt exist');
      }
    } else {
      throw new NotFoundException('User was not found.');
    }
  }

  async isCartExist(
    id: string,
    { productId, color }: Omit<AddItemToCartDto, 'amount'>,
  ) {
    const existingCart = await this.prisma.cart.findFirst({
      where: {
        userId: id,
        productId,
        color,
      },
    });
    return existingCart;
  }

  async updateExistingCart(
    existingCart: Cart,
    { productId, amount, color }: AddItemToCartDto,
  ) {
    await this.prisma.cart
      .update({
        where: {
          id: existingCart.id,
        },
        data: {
          amount: existingCart.amount + amount,
        },
      })
      .then(() => this.updateColors({ productId, amount, color }));
    return {
      statusCode: 200,
      message: 'Product has been added to your cart',
    };
  }

  async IsColorExist({ productId, color }: Omit<AddItemToCartDto, 'amount'>) {
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
    const difference = shouldUpdateColor[color] - amount;
    if (difference == 0) {
      await this.updateAvailableColors(productId, color);
    }
    const obj = Object.fromEntries([[color, difference]]);
    await this.prisma.color.update({
      where: { productId },
      data: obj,
    });
  }

  async updateAvailableColors(productId: string, color: string) {
    let { availableColors } = await this.prisma.products.findFirst({
      where: { id: productId },
    });
    availableColors = availableColors.filter(
      (availableColor) => availableColor != color,
    );
    await this.prisma.products.update({
      where: { id: productId },
      data: {
        availableColors,
      },
    });
  }

  async removeFromCart(id: string, { removingItems }: RemoveFromCartDto) {
    const isExistUser = await this.checkExistingUser(id);
    if (isExistUser) {
      for (const item of removingItems) {
        const isExistCart = await this.checkExistingCart(item.id);
        const isExistProduct = await this.checkExistingProduct(item.productId);
        if (isExistCart && isExistProduct) {
          await this.removeItem(item.id);
          await this.updateAvailbaleColorAfterDelete(
            item.productId,
            item.color,
          );
          await this.updateColorsAfterDelete(item);
        } else {
          if (!isExistCart) {
            throw new NotFoundException('Cart was not found.');
          } else {
            throw new NotFoundException('Product was not found.');
          }
        }
      }
      return {
        statusCode: 200,
        message: 'Product has been deleted from your cart',
      };
    } else {
      throw new NotFoundException('User was not found.');
    }
  }
  async checkExistingCart(id: string) {
    const isExist = await this.prisma.cart.findFirst({
      where: { id },
    });
    return isExist ? true : false;
  }
  async checkExistingUser(id: string) {
    const isExist = await this.prisma.user.findFirst({
      where: { id },
    });
    return isExist ? true : false;
  }
  async checkExistingProduct(id: string) {
    const isExist = await this.prisma.products.findFirst({
      where: { id },
    });
    return isExist ? true : false;
  }
  async removeItem(id: string) {
    await this.prisma.cart.delete({
      where: {
        id,
      },
    });
  }
  async updateAvailbaleColorAfterDelete(id: string, color: string) {
    const { availableColors } = await this.prisma.products.findFirst({
      where: { id },
    });
    if (!availableColors.includes(color)) {
      await this.prisma.products.update({
        where: { id },
        data: {
          availableColors: [...availableColors, color],
        },
      });
    }
  }
  async updateColorsAfterDelete({ productId, color, amount }: RemovingItemDto) {
    const shouldUpdateColor = await this.prisma.color.findFirst({
      where: { productId },
    });
    const difference = shouldUpdateColor[color] + amount;
    const obj = Object.fromEntries([[color, difference]]);
    await this.prisma.color.update({
      where: { productId },
      data: obj,
    });
  }
}
