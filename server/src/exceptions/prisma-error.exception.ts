import { Prisma } from '../generated/prisma/client';
import { ApiError } from './api-error.exception';

export const handlePrismaError = (error: unknown): ApiError | null => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (error.code) {
    case 'P2002':
      return ApiError.conflict('Already exists');
    case 'P2025':
      return ApiError.notFound('Record not found');
    case 'P2003':
      return ApiError.conflict(
        'The record is linked to other records or points to a missing one',
      );
    default:
      return null;
  }
};
