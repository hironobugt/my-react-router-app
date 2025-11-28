import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL || './data/app.db';

// Create database connection
const sqlite = new Database(DATABASE_URL);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

// Export types
export type DbType = typeof db;
