import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ApiError } from '../../exceptions/api-error.exception';
import { TokenPayload } from '../auth.types';
import { ACCESS_TOKEN_COOKIE } from '../auth.constants';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE] as string | undefined;

    if (!token) {
      throw ApiError.unauthorized('Not authenticated');
    }

    try {
      req.user = this.jwt.verify<TokenPayload>(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired access token');
    }

    return true;
  }
}
