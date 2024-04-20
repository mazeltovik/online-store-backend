import { registerDecorator, ValidationOptions } from 'class-validator';
import { Obj } from './objectType';

export function MatchUpperCasePattern(validationOptions?: ValidationOptions) {
  return function (object: Obj, propertyName: string) {
    registerDecorator({
      name: 'matchUpperCasePattern',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const regExp = /[A-Z]+/g;
          return regExp.test(value);
        },
      },
    });
  };
}
