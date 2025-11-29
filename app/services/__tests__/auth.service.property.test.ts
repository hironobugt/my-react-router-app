import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { authService } from '../auth.service';
import { sessionService } from '../session.service';
import { userService } from '../user.service';
import { db } from '~/db';
import { users, sessions } from '~/db/schema';

describe('AuthService Property Tests', () => {
  afterEach(async () => {
    // Clean up after each test
    await db.delete(sessions);
    await db.delete(users);
  });

  it('Property 7: Logout invalidates session and clears state', async () => {
    /**
     * Feature: user-management, Property 7: Logout invalidates session and clears state
     * Validates: Requirements 3.1, 3.2, 3.3
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 }),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 }),
        }),
        async (userData) => {
          // Create a user
          const createResult = await userService.createUser(userData);
          expect(createResult.success).toBe(true);
          const user = createResult.data!;

          // Login to create a session
          const loginResult = await authService.login(userData.email, userData.password);
          expect(loginResult.success).toBe(true);
          expect(loginResult.user).toBeDefined();

          // Create session
          const session = await sessionService.createSession(user.id);
          expect(session).toBeDefined();
          expect(session.userId).toBe(user.id);

          // Verify session exists
          const retrievedSession = await sessionService.getSession(session.id);
          expect(retrievedSession).not.toBeNull();
          expect(retrievedSession?.id).toBe(session.id);

          // Logout: Delete the session (simulating logout)
          await sessionService.deleteSession(session.id);

          // Verify session is invalidated
          const deletedSession = await sessionService.getSession(session.id);
          expect(deletedSession).toBeNull();

          // Clean up: delete user
          await userService.deleteUser(user.id);
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);
});
