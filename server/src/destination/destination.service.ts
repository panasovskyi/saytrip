import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiSuggestion } from '../ai/schemas/ai-suggestion.schema';
import { Env } from '../config/env.schema';
import { unsplashSearchSchema } from './schemas/unsplash-search.schema';

export interface DestinationImage {
  url: string;
  authorName: string;
  authorUrl: string;
}

export interface DestinationLinks {
  hotels: string;
  tickets: string;
}

export type EnrichedDestination = AiSuggestion['destinations'][number] & {
  image: DestinationImage | null;
  links: DestinationLinks;
};

export type EnrichedSuggestion = Omit<AiSuggestion, 'destinations'> & {
  destinations: EnrichedDestination[];
};

const UNSPLASH_UTM = 'utm_source=saytrip&utm_medium=referral';

function slugify(name: string): string {
  return name
    .normalize('NFD') // á → a + ́
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class DestinationService {
  private readonly logger = new Logger(DestinationService.name);

  constructor(private readonly configService: ConfigService<Env, true>) {}

  async enrich(payload: AiSuggestion): Promise<EnrichedSuggestion> {
    const destinations = await Promise.all(
      payload.destinations.map(async (destination) => {
        const image = await this.getImage(destination.imageQuery);
        const hotelCitySlug = slugify(destination.nameEn);
        const hotelCountryCode = destination.countryCode.toLowerCase();
        const hotelsUrl = new URL(
          `https://www.booking.com/city/${hotelCountryCode}/${hotelCitySlug}.html`,
        );

        hotelsUrl.searchParams.set('aid', 'test_aid');

        return {
          ...destination,
          image,
          links: {
            hotels: hotelsUrl.toString(),
            tickets: 'https://skyscanner.com',
          },
        };
      }),
    );

    return {
      ...payload,
      destinations,
    };
  }

  private async getImage(query: string): Promise<DestinationImage | null> {
    const accessKey = this.configService.get('UNSPLASH_ACCESS_KEY', {
      infer: true,
    });

    if (!accessKey) {
      this.logger.warn('UNSPLASH_ACCESS_KEY is not set, skipping images');
      return null;
    }

    try {
      const url = new URL('https://api.unsplash.com/search/photos');
      url.searchParams.set('query', query);
      url.searchParams.set('per_page', '1');
      url.searchParams.set('orientation', 'landscape');

      const response = await fetch(url, {
        headers: { Authorization: `Client-ID ${accessKey}` },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        this.logger.warn(
          `Unsplash responded with ${response.status} for "${query}"`,
        );
        return null;
      }

      const { results } = unsplashSearchSchema.parse(await response.json());
      const photo = results[0];

      if (!photo) {
        return null;
      }

      return {
        url: photo.urls.regular,
        authorName: photo.user.name,
        authorUrl: `${photo.user.links.html}?${UNSPLASH_UTM}`,
      };
    } catch (error) {
      this.logger.warn(
        `Could not load an image for "${query}": ${String(error)}`,
      );
      return null;
    }
  }
}
