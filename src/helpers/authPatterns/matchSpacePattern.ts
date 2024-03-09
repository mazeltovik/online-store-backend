import { registerDecorator, ValidationOptions } from 'class-validator';
import { Obj } from './objectType';

export function MatchSpacePattern(validationOptions?: ValidationOptions) {
  return function (object: Obj, propertyName: string) {
    registerDecorator({
      name: 'matchSpacePattern',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const regExp = /\s/g;
          return !regExp.test(value);
        },
      },
    });
  };
}
