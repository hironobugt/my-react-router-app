import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { userService } from '../user.service';
import { clearTestDatabase } from '../../test/helpers';

describe('UserService Property Tests', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  it('Property 1: Valid user registration creates database entry', async () => {
    /**
     * Feature: user-management, Property 1: Valid user registration creates database entry
     * Validates: Requirements 1.1
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 }),
        }),
        async (userData) => {
          // Clear database before each property test iteration
          await clearTestDatabase();

          const result = await userService.createUser(userData);

          expect(result.success).toBe(true);
          expect(result.data).toBeDefined();

          const dbUser = await userService.getUserByEmail(userData.email);
          expect(dbUser).toBeDefined();
          expect(dbUser?.username).toBe(userData.username);
          expect(dbUser?.email).toBe(userData.email);
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

  it('Property 2: Duplicate email registration is rejected', async () => {
    /**
     * Feature: user-management, Property 2: Duplicate email registration is rejected
     * Validates: Requirements 1.2
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username1: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          username2: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          email: fc.emailAddress(),
          password1: fc.string({ minLength: 8, maxLength: 50 }),
          password2: fc.string({ minLength: 8, maxLength: 50 }),
        }),
        async (data) => {
          await clearTestDatabase();

          // Create first user
          const result1 = await userService.createUser({
            username: data.username1,
            email: data.email,
            password: data.password1,
          });

          expect(result1.success).toBe(true);

          // Try to create second user with same email
          const result2 = await userService.createUser({
            username: data.username2,
            email: data.email,
            password: data.password2,
          });

          expect(result2.success).toBe(false);
          expect(result2.errors?.email).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('Property 3: Invalid email format is rejected', async () => {
    /**
     * Feature: user-management, Property 3: Invalid email format is rejected
     * Validates: Requirements 1.3
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          // Generate invalid emails (strings without @ or proper domain)
          email: fc.oneof(
            fc.string().filter(s => !s.includes('@')),
            fc.string().map(s => s + '@'),
            fc.string().map(s => '@' + s),
            fc.string().filter(s => s.includes('@') && !s.includes('.'))
          ),
          password: fc.string({ minLength: 8, maxLength: 50 }),
        }),
        async (userData) => {
          await clearTestDatabase();

          const result = await userService.createUser(userData);

          expect(result.success).toBe(false);
          expect(result.errors?.email).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('Property 4: Password is hashed before storage', async () => {
    /**
     * Feature: user-management, Property 4: Password is hashed before storage
     * Validates: Requirements 1.5
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 }),
        }),
        async (userData) => {
          await clearTestDatabase();

          const result = await userService.createUser(userData);

          expect(result.success).toBe(true);

          // Get user with password hash from repository
          const { userRepository } = await import('../../repositories/user.repository');
          const dbUser = await userRepository.findByEmailWithPassword(userData.email);

          // Password should be hashed (not equal to plain text)
          expect(dbUser?.passwordHash).not.toBe(userData.password);
          expect(dbUser?.passwordHash).toBeDefined();
          expect(dbUser?.passwordHash.length).toBeGreaterThan(0);

          // Should be verifiable
          const { authService } = await import('../auth.service');
          const isValid = await authService.verifyPassword(
            userData.password,
            dbUser!.passwordHash
          );
          expect(isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('Property 5: Valid credentials create authenticated session', async () => {
    /**
     * Feature: user-management, Property 5: Valid credentials create authenticated session
     * Validates: Requirements 2.1, 2.4, 2.5
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 }),
        }),
        async (userData) => {
          await clearTestDatabase();

          // Create user
          const createResult = await userService.createUser(userData);
          expect(createResult.success).toBe(true);

          // Login with correct credentials
          const { authService } = await import('../auth.service');
          const loginResult = await authService.login(userData.email, userData.password);

          expect(loginResult.success).toBe(true);
          expect(loginResult.user).toBeDefined();
          expect(loginResult.user?.email).toBe(userData.email);
          expect(loginResult.user?.username).toBe(userData.username);
          expect(loginResult.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('Property 6: Invalid credentials are rejected', async () => {
    /**
     * Feature: user-management, Property 6: Invalid credentials are rejected
     * Validates: Requirements 2.2, 2.3
     */
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
          email: fc.emailAddress(),
          correctPassword: fc.string({ minLength: 8, maxLength: 50 }),
          wrongPassword: fc.string({ minLength: 8, maxLength: 50 }),
        }).filter(data => data.correctPassword !== data.wrongPassword),
        async (userData) => {
          await clearTestDatabase();

          // Create user
          const createResult = await userService.createUser({
            username: userData.username,
            email: userData.email,
            password: userData.correctPassword,
          });
          expect(createResult.success).toBe(true);

          // Try to login with wrong password
          const { authService } = await import('../auth.service');
          const loginResult = await authService.login(userData.email, userData.wrongPassword);

          expect(loginResult.success).toBe(false);
          expect(loginResult.user).toBeUndefined();
          expect(loginResult.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
