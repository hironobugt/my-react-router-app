import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  validateRegistration,
  validateProfileUpdate,
} from '../validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should accept valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.jp')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should accept passwords with 8 or more characters', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('12345678')).toBe(true);
    });

    it('should reject passwords with less than 8 characters', () => {
      expect(isValidPassword('short')).toBe(false);
      expect(isValidPassword('1234567')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should accept usernames with 3 or more characters', () => {
      expect(isValidUsername('user')).toBe(true);
      expect(isValidUsername('testuser')).toBe(true);
    });

    it('should reject usernames with less than 3 characters', () => {
      expect(isValidUsername('ab')).toBe(false);
      expect(isValidUsername('a')).toBe(false);
      expect(isValidUsername('')).toBe(false);
    });
  });

  describe('validateRegistration', () => {
    it('should return null for valid registration data', () => {
      const result = validateRegistration({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toBeNull();
    });

    it('should return errors for invalid username', () => {
      const result = validateRegistration({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).not.toBeNull();
      expect(result?.username).toBeDefined();
    });

    it('should return errors for invalid email', () => {
      const result = validateRegistration({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result).not.toBeNull();
      expect(result?.email).toBeDefined();
    });

    it('should return errors for invalid password', () => {
      const result = validateRegistration({
        username: 'testuser',
        email: 'test@example.com',
        password: 'short',
      });
      expect(result).not.toBeNull();
      expect(result?.password).toBeDefined();
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const result = validateRegistration({
        username: 'ab',
        email: 'invalid',
        password: 'short',
      });
      expect(result).not.toBeNull();
      expect(result?.username).toBeDefined();
      expect(result?.email).toBeDefined();
      expect(result?.password).toBeDefined();
    });
  });

  describe('validateProfileUpdate', () => {
    it('should return null for valid profile update data', () => {
      const result = validateProfileUpdate({
        username: 'newusername',
        email: 'newemail@example.com',
      });
      expect(result).toBeNull();
    });

    it('should return null for partial valid updates', () => {
      expect(validateProfileUpdate({ username: 'newusername' })).toBeNull();
      expect(validateProfileUpdate({ email: 'new@example.com' })).toBeNull();
    });

    it('should return errors for invalid username', () => {
      const result = validateProfileUpdate({ username: 'ab' });
      expect(result).not.toBeNull();
      expect(result?.username).toBeDefined();
    });

    it('should return errors for invalid email', () => {
      const result = validateProfileUpdate({ email: 'invalid' });
      expect(result).not.toBeNull();
      expect(result?.email).toBeDefined();
    });
  });
});
