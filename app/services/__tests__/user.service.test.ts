import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from '../user.service';
import { clearTestDatabase } from '../../test/helpers';

describe('UserService', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      const result = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.username).toBe('testuser');
      expect(result.data?.email).toBe('test@example.com');
      expect(result.errors).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await userService.createUser({
        username: 'user1',
        email: 'test@example.com',
        password: 'password123',
      });

      // Try to create second user with same email
      const result = await userService.createUser({
        username: 'user2',
        email: 'test@example.com',
        password: 'password456',
      });

      expect(result.success).toBe(false);
      expect(result.errors?.email).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const result = await userService.createUser({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.errors?.email).toBeDefined();
    });

    it('should reject short password', async () => {
      const result = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'short',
      });

      expect(result.success).toBe(false);
      expect(result.errors?.password).toBeDefined();
    });

    it('should reject short username', async () => {
      const result = await userService.createUser({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.errors?.username).toBeDefined();
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const created = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const user = await userService.getUserById(created.data!.id);

      expect(user).toBeDefined();
      expect(user?.id).toBe(created.data!.id);
      expect(user?.username).toBe('testuser');
    });

    it('should return null for non-existent ID', async () => {
      const user = await userService.getUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const user = await userService.getUserByEmail('test@example.com');

      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
      expect(user?.username).toBe('testuser');
    });

    it('should return null for non-existent email', async () => {
      const user = await userService.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await userService.createUser({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
      });

      await userService.createUser({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
      });

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users.map(u => u.username)).toContain('user1');
      expect(users.map(u => u.username)).toContain('user2');
    });

    it('should return empty array when no users exist', async () => {
      const users = await userService.getAllUsers();
      expect(users).toHaveLength(0);
    });
  });

  describe('updateUser', () => {
    it('should update user with valid data', async () => {
      const created = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const result = await userService.updateUser(created.data!.id, {
        username: 'updateduser',
        email: 'updated@example.com',
      });

      expect(result.success).toBe(true);
      expect(result.data?.username).toBe('updateduser');
      expect(result.data?.email).toBe('updated@example.com');
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      const created = await userService.createUser({
        username: 'deleteuser',
        email: 'delete@example.com',
        password: 'password123',
      });

      expect(created.success).toBe(true);
      expect(created.data).toBeDefined();

      const result = await userService.deleteUser(created.data!.id);

      expect(result.success).toBe(true);

      const user = await userService.getUserById(created.data!.id);
      expect(user).toBeNull();
    });

    it('should fail to delete non-existent user', async () => {
      const result = await userService.deleteUser('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.errors?.general).toBeDefined();
    });
  });
});
