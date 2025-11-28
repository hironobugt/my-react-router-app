import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const DATABASE_URL = process.env.DATABASE_URL || './data/app.db';

export async function runMigrations() {
  try {
    // Ensure data directory exists
    const dbDir = dirname(DATABASE_URL);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    // Create database connection
    const sqlite = new Database(DATABASE_URL);
    sqlite.pragma('foreign_keys = ON');

    const db = drizzle(sqlite);

    // Run migrations
    console.log('Running migrations...');
    migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully');

    sqlite.close();
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}
