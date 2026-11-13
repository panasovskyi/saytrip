import { Module } from '@nestjs/common';
import { DestinationService } from './destination.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DestinationService],
  exports: [DestinationService],
})
export class DestinationModule {}