import { PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';
import { ApiError } from '../exceptions/api-error.exception';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw ApiError.validationError(result.error);
    }

    return result.data;
  }
}
