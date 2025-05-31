import { z } from 'zod';

const configSchema = z.object({
  supabase: z.object({
    url: z.string().url().optional(),
    anonKey: z.string().optional(),
  }),
  sqlite: z.object({
    dbPath: z.string().default('./data/mcp-cache.db'),
  }),
  logging: z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  }),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
});

export type Config = z.infer<typeof configSchema>;

export const config: Config = configSchema.parse({
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
  sqlite: {
    dbPath: process.env.SQLITE_DB_PATH || './data/mcp-cache.db',
  },
  logging: {
    level: (process.env.MCP_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  },
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
});
