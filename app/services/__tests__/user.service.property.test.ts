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

  it('Property 8: User list returns all users without sensitive data', async () => {
    /**
     * Feature: user-management, Property 8: User list returns all users without sensitive data
     * Validates: Requirements 4.1, 4.2, 4.3
     */
    await fc.assert(
      fc.asyncProperty(
        // Generate an array of 1-10 users
        fc.array(
          fc.record({
            username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 50 }),
          }),
          { minLength: 1, maxLength: 10 }
        ).chain(users => {
          // Ensure unique emails
          const uniqueEmails = new Set<string>();
          const uniqueUsers = users.filter(user => {
            if (uniqueEmails.has(user.email)) {
              return false;
            }
            uniqueEmails.add(user.email);
            return true;
          });
          return fc.constant(uniqueUsers);
        }),
        async (usersData) => {
          await clearTestDatabase();

          // Create all users
          const createdUsers = [];
          for (const userData of usersData) {
            const result = await userService.createUser(userData);
            expect(result.success).toBe(true);
            if (result.data) {
              createdUsers.push(result.data);
            }
          }

          // Get all users from the service
          const allUsers = await userService.getAllUsers();

          // Property 1: Should return exactly N users where N is the number created
          expect(allUsers.length).toBe(createdUsers.length);

          // Property 2: Each user should contain username, email, and createdAt
          allUsers.forEach(user => {
            expect(user.username).toBeDefined();
            expect(user.email).toBeDefined();
            expect(user.createdAt).toBeDefined();
            expect(user.id).toBeDefined();
            expect(user.updatedAt).toBeDefined();
          });

          // Property 3: No user should contain passwordHash
          allUsers.forEach(user => {
            // TypeScript type system ensures User type doesn't have passwordHash
            // But we also verify at runtime that the object doesn't have it
            expect((user as any).passwordHash).toBeUndefined();
          });

          // Property 4: All created users should be in the returned list
          createdUsers.forEach(createdUser => {
            const foundUser = allUsers.find(u => u.id === createdUser.id);
            expect(foundUser).toBeDefined();
            expect(foundUser?.username).toBe(createdUser.username);
            expect(foundUser?.email).toBe(createdUser.email);
          });

          // Property 5: The returned users should match the input data
          usersData.forEach(inputUser => {
            const foundUser = allUsers.find(u => u.email === inputUser.email);
            expect(foundUser).toBeDefined();
            expect(foundUser?.username).toBe(inputUser.username);
            expect(foundUser?.email).toBe(inputUser.email);
          });
        }
      ),
      { numRuns: 100 }
    );
  }, 60000); // Increased timeout for multiple user creation

  it('Property 11: User deletion removes from database and list', async () => {
    /**
     * Feature: user-management, Property 11: User deletion removes from database and list
     * Validates: Requirements 6.2, 6.3
     */
    await fc.assert(
      fc.asyncProperty(
        // Generate multiple users to test deletion
        fc.array(
          fc.record({
            username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 50 }),
          }),
          { minLength: 2, maxLength: 5 }
        ).chain(users => {
          // Ensure unique emails
          const uniqueEmails = new Set<string>();
          const uniqueUsers = users.filter(user => {
            if (uniqueEmails.has(user.email)) {
              return false;
            }
            uniqueEmails.add(user.email);
            return true;
          });
          return fc.constant(uniqueUsers);
        }),
        async (usersData) => {
          await clearTestDatabase();

          // Create all users
          const createdUsers = [];
          for (const userData of usersData) {
            const result = await userService.createUser(userData);
            expect(result.success).toBe(true);
            if (result.data) {
              createdUsers.push(result.data);
            }
          }

          // Select a random user to delete (first one for simplicity)
          const userToDelete = createdUsers[0];
          const initialCount = createdUsers.length;

          // Get initial user list
          const usersBeforeDelete = await userService.getAllUsers();
          expect(usersBeforeDelete.length).toBe(initialCount);

          // Delete the user
          const deleteResult = await userService.deleteUser(userToDelete.id);
          expect(deleteResult.success).toBe(true);

          // Property 1: User should be removed from database
          const deletedUser = await userService.getUserById(userToDelete.id);
          expect(deletedUser).toBeNull();

          // Property 2: User list should not include deleted user
          const usersAfterDelete = await userService.getAllUsers();
          expect(usersAfterDelete.length).toBe(initialCount - 1);

          const foundDeletedUser = usersAfterDelete.find(u => u.id === userToDelete.id);
          expect(foundDeletedUser).toBeUndefined();

          // Property 3: Other users should still exist
          const otherUsers = createdUsers.filter(u => u.id !== userToDelete.id);
          otherUsers.forEach(otherUser => {
            const foundUser = usersAfterDelete.find(u => u.id === otherUser.id);
            expect(foundUser).toBeDefined();
            expect(foundUser?.username).toBe(otherUser.username);
            expect(foundUser?.email).toBe(otherUser.email);
          });

          // Property 4: Attempting to get deleted user by email should return null
          const deletedUserByEmail = await userService.getUserByEmail(userToDelete.email);
          expect(deletedUserByEmail).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});