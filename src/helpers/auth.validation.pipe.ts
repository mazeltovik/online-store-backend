import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    if (
      object.hasOwnProperty('removingItems') &&
      Array.isArray(object.removingItems)
    ) {
      const { removingItems } = object;
      for (let i = 0; i < removingItems.length; i++) {
        const errors = await validate(removingItems[i]);
        if (errors.length > 0) {
          const [firstErr] = Object.values(errors[0].constraints);
          throw new BadRequestException(firstErr);
        }
      }
    } else {
      const errors = await validate(object);
      if (errors.length > 0) {
        const [firstErr] = Object.values(errors[0].constraints);
        throw new BadRequestException(firstErr);
      }
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
