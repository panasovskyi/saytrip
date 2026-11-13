import z from 'zod';

export const aiSuggestionSchema = z.strictObject({
  parsed: z.strictObject({
    when: z
      .string()
      .nullable()
      .describe('When the trip is, as the traveller said it, e.g. "November"'),
    budgetEur: z
      .number()
      .nullable()
      .describe('Total budget for the whole group in EUR'),
    adults: z
      .number()
      .int()
      .nullable()
      .describe(
        'Number of adults the estimates are based on. If the traveller did not say, 1',
      ),
    childrenAges: z.array(z.number().int()),
    from: z.string().nullable().describe('Departure city'),
    vibe: z.array(z.string()).describe('Short tags, e.g. "warm sea", "quiet"'),
  }),
  missingInfo: z
    .array(
      z.strictObject({
        question: z.string(),
        options: z
          .array(z.string())
          .describe('Short answers, e.g. "Yes", "No", "Don\'t mind"'),
      }),
    )
    .max(2),
  destinations: z
    .array(
      z.strictObject({
        name: z.string().describe('Name of the place in the language of the request'),
        nameEn: z
          .string()
          .describe(
            'English name of the place in Latin letters, as written on Booking.com, e.g. "Saas-Fee". Used to build links',
          ),
        country: z.string(),
        countryCode: z
          .string()
          .regex(/^[A-Z]{2}$/)
          .describe('ISO 3166-1 alpha-2 country code in uppercase, e.g. "GB"'),
        why: z
          .string()
          .describe('One or two sentences on why it fits the request'),
        weather: z.strictObject({
          tempC: z
            .number()
            .describe('Typical daytime high in °C for the travel month'),
          summary: z.string(),
        }),
        flightTimeMin: z
          .number()
          .int()
          .describe(
            'One-way flight time in whole minutes, e.g. 255 for 4h 15m. Fastest typical option, direct if one exists',
          ),
        nights: z
          .number()
          .int()
          .describe(
            'Number of nights the cost is based on. If the traveller did not say, assume a typical length for this kind of trip',
          ),
        estCostEur: z
          .number()
          .describe(
            'Estimated total in EUR for flights and accommodation for the whole group, for the given number of nights',
          ),
        highlights: z.array(z.string()).min(2).max(4),
        imageQuery: z
          .string()
          .describe('Short English search query for a photo of the place'),
        airportIata: z
          .string()
          .regex(/^[A-Z]{3}$/)
          .nullable(),
      }),
    )
    .max(3),
});

export type AiSuggestion = z.infer<typeof aiSuggestionSchema>;
