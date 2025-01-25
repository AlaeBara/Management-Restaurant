import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    isString,
} from 'class-validator';

export function IsULID(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isULID',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!isString(value)) return false;
                    
                    // ULID is 26 characters
                    if (value.length !== 26) return false;
                    
                    // First character should be between 0-7 due to timestamp encoding
                    if (!/^[0-7]/.test(value)) return false;
                    
                    // Rest should be Crockford's Base32 (0-9A-Z, excluding I, L, O, U)
                    return /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid ULID`;
                },
            },
        });
    };
}
