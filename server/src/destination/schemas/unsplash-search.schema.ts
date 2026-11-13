import z from 'zod';

export const unsplashSearchSchema = z.object({
  results: z.array(
    z.object({
      urls: z.object({ regular: z.string() }),
      user: z.object({
        name: z.string(),
        links: z.object({ html: z.string() }),
      }),
    }),
  ),
});
