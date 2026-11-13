import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { handlePrismaError } from './prisma-error.exception';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const error = exception instanceof HttpException ? exception : handlePrismaError(exception);

    if (error) {
      const body = error.getResponse();

      return res
        .status(error.getStatus())
        .json(typeof body === 'string' ? { message: body } : body);
    }

    this.logger.error(`[${req.method}] ${req.originalUrl}`);

    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
}
