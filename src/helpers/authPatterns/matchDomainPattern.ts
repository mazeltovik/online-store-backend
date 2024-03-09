import { registerDecorator, ValidationOptions } from 'class-validator';
import { Obj } from './objectType';

export function MatchDomainPattern(validationOptions?: ValidationOptions) {
  return function (object: Obj, propertyName: string) {
    registerDecorator({
      name: 'matchDomainPattern',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const regExp =
            /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g;
          return regExp.test(value);
        },
      },
    });
  };
}
