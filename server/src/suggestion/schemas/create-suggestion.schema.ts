import z from 'zod';

export const createSuggestionSchema = z.strictObject({
  input: z.string().trim().min(10).max(1000),
});
export type CreateSuggestionPayload = z.infer<typeof createSuggestionSchema>;