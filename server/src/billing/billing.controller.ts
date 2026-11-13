import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  type RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { BillingService } from './billing.service';
import { CheckoutSessionResponse } from './billing.types';
import {
  type CheckoutPayload,
  checkoutSchema,
} from './schemas/checkout.schema';
import { Throttle } from '@nestjs/throttler';
import { UserThrottleGuard } from '../auth/guards/user-throttle.guard';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(JwtGuard, UserThrottleGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('checkout')
  async createCheckout(
    @CurrentUser('id')
    userId: string,
    @Body(new ZodValidationPipe(checkoutSchema))
    payload: CheckoutPayload,
  ): Promise<CheckoutSessionResponse> {
    return await this.billingService.createCheckoutSession(
      userId,
      payload.plan,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string | undefined,
  ): Promise<{ received: true }> {
    await this.billingService.handleWebhook(req.rawBody, signature);

    return { received: true };
  }
}
