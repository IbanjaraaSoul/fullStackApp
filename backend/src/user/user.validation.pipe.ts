import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';

@Injectable()
export class UserValidationPipe implements PipeTransform {
  constructor(private readonly codec: t.Type<any>) {}

  transform(value: any) {
    const result = this.codec.decode(value);
    
    if (E.isLeft(result)) {
      const errors = result.left.map(error => {
        const field = error.context.map(c => c.key).join('.') || 'unknown';
        return {
          field,
          message: error.message || 'Invalid value',
        };
      });
      
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }
    
    return result.right;
  }
}
