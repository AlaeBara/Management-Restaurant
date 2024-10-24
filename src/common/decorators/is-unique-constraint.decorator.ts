import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Repository } from 'typeorm';


/* @ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        const [model, field] = args.constraints;
        const count = await (this.baseService.repository[model as keyof Repository<any>] as any).count({
          where: {
            [field]: value
          }
        });
        return count === 0;
      }

  defaultMessage(args: ValidationArguments) {
    const [model, field] = args.constraints;
    return `${field} must be unique in ${model}`;
  }
} */

/* export function IsUnique(constraints: [string, string], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: constraints,
      validator: IsUniqueConstraint,
    });
  };
} */