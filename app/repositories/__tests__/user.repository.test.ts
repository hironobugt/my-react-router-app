import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserRepository } from '../user.repository';
import { db } from '../../db';
import { users } from '../../db/schema';
import { runMigrations } from '../../db/migrate';
import { randomUUID } from 'crypto';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    // Run migrations to set up the database
    await runMigrations();
    repository = new UserRepository();
  });

  afterEach(async () => {
    // Clean up all users after each test
    await db.delete(users);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        id: randomUUID(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      const user = await repository.create(userData);

      expect(user.id).toBe(userData.id);
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      // Password hash should not be in the returned user
      expect((user as any).passwordHash).toBeUndefined();
    });

    it('should throw error when creating user with duplicate email', async () => {
      const userData = {
        id: randomUUID(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await repository.create(userData);

      const duplicateUser = {
        id: randomUUID(),
        username: 'testuser2',
        email: 'test@example.com',
        passwordHash: 'hashedpassword456',
      };

      await expect(repository.create(duplicateUser)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find user by ID', async () => {
      const userData = {
        id: randomUUID(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await repository.create(userData);
      const user = await repository.findById(userData.id);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(userData.id);
      expect(user?.username).toBe(userData.username);
      expect(user?.email).toBe(userData.email);
    });

    it('should return null when user not found', async () => {
      const user = await repository.findById('nonexistent-id');
      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const userData = {
        id: randomUUID(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await repository.create(userData);
      const user = await repository.findByEmail(userData.email);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(userData.id);
      expect(user?.email).toBe(userData.email);
    });

    it('should return null when user not found', async () => {
      const user = await repository.findByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should find user with password hash', async () => {
      const userData = {
        id: randomUUID(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await repository.create(userData);
      const user = await repository.findByEmailWithPassword(userData.email);

      expect(user).not.toBeNull();
      expect(user?.passwordHash).toBe(userData.passwordHash);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const user1 = {
        id: randomUUID(),
        username: 'user1',
        email: 'user1@example.com',
        passwordHash: 'hash1',
      };

      const user2 = {
        id: randomUUID(),
        username: 'user2',
        email: 'user2@example.com',
        passwordHash: 'hash2',
      };

      await repository.create(user1);
      await repository.create(user2);

      const allUsers = await repository.findAll();

      expect(allUsers).toHaveLength(2);
      expect(allUsers.map(u => u.email)).toContain(user1.email);
      expect(allUsers.map(u => u.email)).toContain(user2.email);
    });

    it('should return empty array when no users exist', async () => {
      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update user username', async () => {
      const userData = {
        id: randomUUID(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await repository.create(userData);
      const updatedUser = await repository.update(userData.id, {
        username: 'newusername',
      });

      expect(updatedUser.username).toBe('newusername');
      expect(updatedUser.email).toBe(userData.email);
    });

    it('should update user email', async () => {
      const userData = {
        id: randomUUID(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await repository.create(userData);
      const updatedUser = await repository.update(userData.id, {
        email: 'newemail@example.com',
      });

      expect(updatedUser.email).toBe('newemail@example.com');
      expect(updatedUser.username).toBe(userData.username);
    });

    it('should throw error when updating non-existent user', async () => {
      await expect(
        repository.update('nonexistent-id', { username: 'newname' })
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const userData = {
        id: randomUUID(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await repository.create(userData);
      await repository.delete(userData.id);

      const user = await repository.findById(userData.id);
      expect(user).toBeNull();
    });

    it('should throw error when deleting non-existent user', async () => {
      await expect(repository.delete('nonexistent-id')).rejects.toThrow();
    });
  });
});
