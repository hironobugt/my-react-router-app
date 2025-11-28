import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../auth.service';
import { userRepository } from '../../repositories/user.repository';
import { clearTestDatabase } from '../../test/helpers';

describe('AuthenticationService', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testpassword123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testpassword123';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.verifyPassword('wrongpassword', hash);

      expect(isValid).toBe(false);
    });
  });

  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      // Create a test user
      const passwordHash = await authService.hashPassword('password123');
      await userRepository.create({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
      });

      const result = await authService.login('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.user?.username).toBe('testuser');
      expect(result.error).toBeUndefined();
    });

    it('should fail login with incorrect password', async () => {
      // Create a test user
      const passwordHash = await authService.hashPassword('password123');
      await userRepository.create({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
      });

      const result = await authService.login('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    it('should fail login with non-existent email', async () => {
      const result = await authService.login('nonexistent@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.error).toBeDefined();
    });
  });
});
