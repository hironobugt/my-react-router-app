import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from '../../services/user.service';
import { sessionService } from '../../services/session.service';
import { clearTestDatabase } from '../../test/helpers';

// Mock the shared components to avoid Module Federation issues in tests
vi.mock('~/components/shared', () => ({
  UserForm: vi.fn(),
  Button: vi.fn(),
  Input: vi.fn(),
  Label: vi.fn(),
  FormField: vi.fn(),
  UserCard: vi.fn(),
  ClientOnly: vi.fn(({ children }) => children()),
}));

// Import action and loader after mocking
const { action, loader } = await import('../profile');

describe('Profile Route', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('loader', () => {
    it('should return current user data for authenticated user', async () => {
      // Create a test user
      const userResult = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      const user = userResult.data!;

      // Create a session
      const session = await sessionService.createSession(user.id);

      // Create request with session cookie
      const request = new Request('http://localhost/profile', {
        headers: {
          Cookie: `sessionId=${session.id}`,
        },
      });

      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should redirect to login if not authenticated', async () => {
      const request = new Request('http://localhost/profile');

      await expect(
        loader({ request, params: {}, context: {} } as any)
      ).rejects.toThrow();
    });
  });

  describe('action', () => {
    it('should update user profile with valid data', async () => {
      // Create a test user
      const userResult = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      const user = userResult.data!;

      // Create a session
      const session = await sessionService.createSession(user.id);

      // Create update request
      const formData = new FormData();
      formData.append('username', 'updateduser');
      formData.append('email', 'updated@example.com');

      const request = new Request('http://localhost/profile', {
        method: 'POST',
        headers: {
          Cookie: `sessionId=${session.id}`,
        },
        body: formData,
      });

      const result = await action({ request, params: {}, context: {} } as any);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('user');
      expect(result.user?.username).toBe('updateduser');
      expect(result.user?.email).toBe('updated@example.com');
      expect(result).toHaveProperty('message');

      // Verify database was updated
      const updatedUser = await userService.getUserById(user.id);
      expect(updatedUser?.username).toBe('updateduser');
      expect(updatedUser?.email).toBe('updated@example.com');
    });

    it('should return validation errors for invalid email', async () => {
      // Create a test user
      const userResult = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      const user = userResult.data!;

      // Create a session
      const session = await sessionService.createSession(user.id);

      // Create update request with invalid email
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'invalid-email');

      const request = new Request('http://localhost/profile', {
        method: 'POST',
        headers: {
          Cookie: `sessionId=${session.id}`,
        },
        body: formData,
      });

      const result = await action({ request, params: {}, context: {} } as any);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('errors');
      expect(result.errors?.email).toBeDefined();
      expect(result.errors?.email).toContain('有効なメールアドレス');
    });

    it('should return validation errors for short username', async () => {
      // Create a test user
      const userResult = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      const user = userResult.data!;

      // Create a session
      const session = await sessionService.createSession(user.id);

      // Create update request with short username
      const formData = new FormData();
      formData.append('username', 'ab');
      formData.append('email', 'test@example.com');

      const request = new Request('http://localhost/profile', {
        method: 'POST',
        headers: {
          Cookie: `sessionId=${session.id}`,
        },
        body: formData,
      });

      const result = await action({ request, params: {}, context: {} } as any);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('errors');
      expect(result.errors?.username).toBeDefined();
      expect(result.errors?.username).toContain('3文字以上');
    });

    it('should return error for duplicate email', async () => {
      // Create first user
      const user1Result = await userService.createUser({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
      });

      // Create second user
      const user2Result = await userService.createUser({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
      });

      expect(user2Result.success).toBe(true);
      const user2 = user2Result.data!;

      // Create a session for user2
      const session = await sessionService.createSession(user2.id);

      // Try to update user2's email to user1's email
      const formData = new FormData();
      formData.append('username', 'user2');
      formData.append('email', 'user1@example.com');

      const request = new Request('http://localhost/profile', {
        method: 'POST',
        headers: {
          Cookie: `sessionId=${session.id}`,
        },
        body: formData,
      });

      const result = await action({ request, params: {}, context: {} } as any);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('errors');
      expect(result.errors?.email).toBeDefined();
      expect(result.errors?.email).toContain('既に使用されています');
    });

    it('should display success message after successful update', async () => {
      // Create a test user
      const userResult = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      const user = userResult.data!;

      // Create a session
      const session = await sessionService.createSession(user.id);

      // Create update request
      const formData = new FormData();
      formData.append('username', 'updateduser');
      formData.append('email', 'test@example.com');

      const request = new Request('http://localhost/profile', {
        method: 'POST',
        headers: {
          Cookie: `sessionId=${session.id}`,
        },
        body: formData,
      });

      const result = await action({ request, params: {}, context: {} } as any);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('プロフィールを更新しました');
    });
  });
});
