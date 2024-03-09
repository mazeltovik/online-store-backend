import { registerDecorator, ValidationOptions } from 'class-validator';
import { Obj } from './objectType';

export function MatchLowerCasePattern(validationOptions?: ValidationOptions) {
  return function (object: Obj, propertyName: string) {
    registerDecorator({
      name: 'matchLowerCasePattern',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const regExp = /[a-z]+/g;
          return regExp.test(value);
        },
      },
    });
  };
}
