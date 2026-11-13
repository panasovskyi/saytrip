import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { type CreateSuggestionPayload, createSuggestionSchema } from './schemas/create-suggestion.schema';
import { type EnrichedSuggestion } from '../destination/destination.service';
import { AppThrottlerGuard } from '../auth/guards/app-throttler.guard';

@Controller('suggestions')
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Post()
  @UseGuards(AppThrottlerGuard)
  async create(
    @Body(new ZodValidationPipe(createSuggestionSchema))
    payload: CreateSuggestionPayload,
  ): Promise<EnrichedSuggestion> {
    return await this.suggestionService.create(payload);
  }
}