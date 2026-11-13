import { Module } from '@nestjs/common';
import { SuggestionController } from './suggestion.controller';
import { SuggestionService } from './suggestion.service';
import { DestinationModule } from '../destination/destination.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [DestinationModule, AiModule],
  controllers: [SuggestionController],
  providers: [SuggestionService],
  exports: [],
})
export class SuggestionModule {}