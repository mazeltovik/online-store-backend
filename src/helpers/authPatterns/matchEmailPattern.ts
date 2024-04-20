import { registerDecorator, ValidationOptions } from 'class-validator';
import { Obj } from './objectType';

export function MatchEmailPattern(validationOptions?: ValidationOptions) {
  return function (object: Obj, propertyName: string) {
    registerDecorator({
      name: 'matchEmailPattern',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
          return regExp.test(value);
        },
      },
    });
  };
}
