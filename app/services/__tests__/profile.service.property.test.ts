import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { userService } from '../user.service';
import { clearTestDatabase } from '../../test/helpers';

describe('Profile Service Property Tests', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  it('Property 9: Profile update persists changes and updates state', async () => {
    /**
     * Feature: user-management, Property 9: Profile update persists changes and updates state
     * Validates: Requirements 5.2, 5.4, 5.5
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Initial user data
          initialUsername: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          initialEmail: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 }),
          // Updated user data
          updatedUsername: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          updatedEmail: fc.emailAddress(),
        }),
        async (data) => {
          await clearTestDatabase();

          // Create initial user
          const createResult = await userService.createUser({
            username: data.initialUsername,
            email: data.initialEmail,
            password: data.password,
          });

          expect(createResult.success).toBe(true);
          expect(createResult.data).toBeDefined();
          const userId = createResult.data!.id;

          // Update user profile
          const updateResult = await userService.updateUser(userId, {
            username: data.updatedUsername,
            email: data.updatedEmail,
          });

          // Property 1: Update should succeed
          expect(updateResult.success).toBe(true);
          expect(updateResult.data).toBeDefined();

          // Property 2: Returned data should contain updated values
          expect(updateResult.data?.username).toBe(data.updatedUsername);
          expect(updateResult.data?.email).toBe(data.updatedEmail);
          expect(updateResult.data?.id).toBe(userId);

          // Property 3: Changes should be persisted in database
          const dbUser = await userService.getUserById(userId);
          expect(dbUser).toBeDefined();
          expect(dbUser?.username).toBe(data.updatedUsername);
          expect(dbUser?.email).toBe(data.updatedEmail);

          // Property 4: User should be retrievable by new email
          const userByEmail = await userService.getUserByEmail(data.updatedEmail);
          expect(userByEmail).toBeDefined();
          expect(userByEmail?.id).toBe(userId);
          expect(userByEmail?.username).toBe(data.updatedUsername);
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  it('Property 10: Profile update rejects duplicate email', async () => {
    /**
     * Feature: user-management, Property 10: Profile update rejects duplicate email
     * Validates: Requirements 5.3
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // User 1 data
          username1: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          email1: fc.emailAddress(),
          password1: fc.string({ minLength: 8, maxLength: 50 }),
          // User 2 data
          username2: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          email2: fc.emailAddress(),
          password2: fc.string({ minLength: 8, maxLength: 50 }),
          // Updated username for user 2
          updatedUsername: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
        }).filter(data => data.email1 !== data.email2), // Ensure different emails
        async (data) => {
          await clearTestDatabase();

          // Create first user
          const createResult1 = await userService.createUser({
            username: data.username1,
            email: data.email1,
            password: data.password1,
          });
          expect(createResult1.success).toBe(true);

          // Create second user
          const createResult2 = await userService.createUser({
            username: data.username2,
            email: data.email2,
            password: data.password2,
          });
          expect(createResult2.success).toBe(true);
          const user2Id = createResult2.data!.id;

          // Try to update user2's email to user1's email
          const updateResult = await userService.updateUser(user2Id, {
            username: data.updatedUsername,
            email: data.email1, // Trying to use user1's email
          });

          // Property 1: Update should fail
          expect(updateResult.success).toBe(false);

          // Property 2: Should return error about duplicate email
          expect(updateResult.errors).toBeDefined();
          expect(updateResult.errors?.email).toBeDefined();
          expect(updateResult.errors?.email).toContain('既に使用されています');

          // Property 3: User2's data should remain unchanged in database
          const dbUser2 = await userService.getUserById(user2Id);
          expect(dbUser2).toBeDefined();
          expect(dbUser2?.username).toBe(data.username2); // Original username
          expect(dbUser2?.email).toBe(data.email2); // Original email

          // Property 4: User1's data should remain unchanged
          const dbUser1 = await userService.getUserByEmail(data.email1);
          expect(dbUser1).toBeDefined();
          expect(dbUser1?.username).toBe(data.username1);
          expect(dbUser1?.email).toBe(data.email1);
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});
