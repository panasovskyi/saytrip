import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PublicUser } from '../user/user.types';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  type RegistrationPayload,
  registrationSchema,
} from './schemas/registration.schema';
import { type LoginPayload, loginSchema } from './schemas/login.schema';
import { CookieOptions, type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_TTL_SECONDS,
} from './auth.constants';
import { JwtGuard } from './guards/jwt.guard';
import { Env } from '../config/env.schema';
import { CurrentUser } from './decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';
import { LoginThrottlerGuard } from './guards/login-throttle.guard';
import { AppThrottlerGuard } from './guards/app-throttler.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @UseGuards(AppThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registrationSchema))
    payload: RegistrationPayload,
  ): Promise<PublicUser> {
    return await this.authService.register(payload);
  }

  @UseGuards(AppThrottlerGuard, LoginThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema))
    payload: LoginPayload,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<PublicUser> {
    const { accessToken, user } = await this.authService.login(payload);

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...this.cookieOptions,
      maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
    });

    return user;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(
    @Res({ passthrough: true })
    res: Response,
  ): void {
    res.clearCookie(ACCESS_TOKEN_COOKIE, this.cookieOptions);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(
    @CurrentUser('id')
    userId: string,
  ): Promise<PublicUser> {
    return await this.authService.getMe(userId);
  }

  private get cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get('NODE_ENV', { infer: true }) === 'production',
      path: '/',
    };
  }
}
