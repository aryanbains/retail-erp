import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Debugging: Check if DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set. Ensure .env.local exists and contains the correct database URL.');
  process.exit(1);
}

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

const config: Config = {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};

export default config;