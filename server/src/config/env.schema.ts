import z from 'zod';

export const envSchema = z
  .object({
    PORT: z.coerce
      .number({ error: 'PORT must be a number, e.g. 5000' })
      .int()
      .positive()
      .default(5000),
    NODE_ENV: z.enum(['development', 'production', 'test'], {
      error: 'NODE_ENV must be one of: development, production, test',
    }),
    CLIENT_URL: z
      .url({
        error: 'CLIENT_URL must be a valid URL, e.g. http://localhost:3000',
      })
      .transform((value) => new URL(value).origin),
    ADMIN_URL: z
      .url({
        error: 'ADMIN_URL must be a valid URL',
      })
      .transform((value) => new URL(value).origin)
      .optional(),
    UNSPLASH_ACCESS_KEY: z.string().optional(),
    SESSION_SECRET: z.string().min(32),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    STRIPE_WEBHOOK_SECRET: z
      .string()
      .min(1, 'STRIPE_WEBHOOK_SECRET is required'),
    STRIPE_SECRET_KEY: z
      .string()
      .startsWith(
        'sk_test_',
        'STRIPE_SECRET_KEY must be a sandbox key (sk_test_...)',
      ),
    AI_MOCK: z
      .enum(['full', 'empty'], { error: 'AI_MOCK must be one of: full, empty' })
      .optional(),
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    TRUST_PROXY: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production' && env.AI_MOCK) {
      ctx.addIssue({
        code: 'custom',
        path: ['AI_MOCK'],
        message: 'AI_MOCK must not be set in production',
      });
    }

    if (!env.AI_MOCK && !env.ANTHROPIC_API_KEY) {
      ctx.addIssue({
        code: 'custom',
        path: ['ANTHROPIC_API_KEY'],
        message: 'ANTHROPIC_API_KEY is required when AI_MOCK is not set',
      });
    }
  });;

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`,
    );
  }

  return result.data;
}
