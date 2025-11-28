import { db } from '../db';
import { users, sessions } from '../db/schema';

/**
 * Clear all data from test database
 */
export async function clearTestDatabase(): Promise<void> {
  await db.delete(sessions);
  await db.delete(users);
}
