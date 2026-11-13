import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import {
  DestinationService,
  type EnrichedSuggestion,
} from '../destination/destination.service';
import { CreateSuggestionPayload } from './schemas/create-suggestion.schema';

@Injectable()
export class SuggestionService {
  constructor(
    private readonly aiService: AiService,
    private readonly destinationService: DestinationService,
  ) {}
  async create(payload: CreateSuggestionPayload): Promise<EnrichedSuggestion> {
    const ai = await this.aiService.suggestDestination(payload.input);
    const suggestions = this.destinationService.enrich(ai);

    return suggestions;
  }
}