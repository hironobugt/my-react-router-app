import { describe, it, expect, beforeAll } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { users, sessions } from '../schema';
import { sql } from 'drizzle-orm';

describe('Database Connection', () => {
  let db: ReturnType<typeof drizzle>;
  let sqlite: Database.Database;

  beforeAll(() => {
    const DATABASE_URL = process.env.DATABASE_URL || './data/test.db';
    
    // Ensure data directory exists
    const dbDir = dirname(DATABASE_URL);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    // Create database connection
    sqlite = new Database(DATABASE_URL);
    sqlite.pragma('foreign_keys = ON');
    db = drizzle(sqlite);

    // Run migrations
    migrate(db, { migrationsFolder: './drizzle' });
  });

  it('should establish database connection successfully', () => {
    expect(db).toBeDefined();
    expect(sqlite).toBeDefined();
  });

  it('should have foreign keys enabled', () => {
    const result = sqlite.pragma('foreign_keys', { simple: true });
    expect(result).toBe(1);
  });

  it('should have users table created', () => {
    const result = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
      .all();
    
    expect(result).toHaveLength(1);
  });

  it('should have sessions table created', () => {
    const result = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='sessions'")
      .all();
    
    expect(result).toHaveLength(1);
  });

  it('should have email index on users table', () => {
    const result = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='email_idx'")
      .all();
    
    expect(result).toHaveLength(1);
  });

  it('should have username index on users table', () => {
    const result = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='username_idx'")
      .all();
    
    expect(result).toHaveLength(1);
  });

  it('should have user_id index on sessions table', () => {
    const result = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='user_id_idx'")
      .all();
    
    expect(result).toHaveLength(1);
  });

  it('should enforce unique constraint on email', async () => {
    const testUser = {
      id: 'test-user-1',
      username: 'testuser1',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
    };

    // Insert first user
    await db.insert(users).values(testUser);

    // Try to insert duplicate email
    await expect(
      db.insert(users).values({
        id: 'test-user-2',
        username: 'testuser2',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
      })
    ).rejects.toThrow();

    // Cleanup
    await db.delete(users).where(sql`id = 'test-user-1'`);
  });

  it('should enforce unique constraint on username', async () => {
    const testUser = {
      id: 'test-user-3',
      username: 'uniqueuser',
      email: 'unique@example.com',
      passwordHash: 'hashedpassword',
    };

    // Insert first user
    await db.insert(users).values(testUser);

    // Try to insert duplicate username
    await expect(
      db.insert(users).values({
        id: 'test-user-4',
        username: 'uniqueuser',
        email: 'another@example.com',
        passwordHash: 'hashedpassword',
      })
    ).rejects.toThrow();

    // Cleanup
    await db.delete(users).where(sql`id = 'test-user-3'`);
  });

  it('should enforce foreign key constraint on sessions', async () => {
    // Try to insert session with non-existent user
    await expect(
      db.insert(sessions).values({
        id: 'test-session-1',
        userId: 'non-existent-user',
        expiresAt: new Date(Date.now() + 86400000),
      })
    ).rejects.toThrow();
  });

  it('should cascade delete sessions when user is deleted', async () => {
    // Create a user
    const testUser = {
      id: 'test-user-5',
      username: 'cascadeuser',
      email: 'cascade@example.com',
      passwordHash: 'hashedpassword',
    };
    await db.insert(users).values(testUser);

    // Create a session for the user
    const testSession = {
      id: 'test-session-2',
      userId: 'test-user-5',
      expiresAt: new Date(Date.now() + 86400000),
    };
    await db.insert(sessions).values(testSession);

    // Verify session exists
    let sessionResult = await db
      .select()
      .from(sessions)
      .where(sql`id = 'test-session-2'`);
    expect(sessionResult).toHaveLength(1);

    // Delete user
    await db.delete(users).where(sql`id = 'test-user-5'`);

    // Verify session was cascade deleted
    sessionResult = await db
      .select()
      .from(sessions)
      .where(sql`id = 'test-session-2'`);
    expect(sessionResult).toHaveLength(0);
  });
});
