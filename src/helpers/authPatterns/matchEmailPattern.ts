import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MatchEmailPattern(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'matchEmailPattern',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
          return regExp.test(value);
        },
      },
    });
  };
}
