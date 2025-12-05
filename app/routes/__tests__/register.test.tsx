import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from '../../services/user.service';
import { clearTestDatabase } from '../../test/helpers';

// Mock the shared components to avoid Module Federation issues in tests
vi.mock('~/components/shared', () => ({
  UserForm: vi.fn(),
  Button: vi.fn(),
  Input: vi.fn(),
  Label: vi.fn(),
  FormField: vi.fn(),
  UserCard: vi.fn(),
}));

// Import action after mocking
const { action } = await import('../register');

// Helper to call action with proper typing
const callAction = (request: Request) => {
  return action({ 
    request, 
    params: {}, 
    context: {} 
  } as any);
};

describe('Register Route', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('action', () => {
    it('should create user with valid data and redirect to login', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');

      const request = new Request('http://localhost/register', {
        method: 'POST',
        body: formData,
      });

      const result = await callAction(request);

      // Should redirect to login
      expect(result).toHaveProperty('status', 302);
      expect(result).toHaveProperty('headers');
      
      const location = (result as Response).headers.get('Location');
      expect(location).toBe('/login');

      // Verify user was created
      const user = await userService.getUserByEmail('test@example.com');
      expect(user).toBeDefined();
      expect(user?.username).toBe('testuser');
    });

    it('should return validation errors for invalid email', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'invalid-email');
      formData.append('password', 'password123');

      const request = new Request('http://localhost/register', {
        method: 'POST',
        body: formData,
      });

      const result = await callAction(request);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.errors.email).toBeDefined();
      expect(data.errors.email).toContain('有効なメールアドレス');
    });

    it('should return validation errors for short password', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'short');

      const request = new Request('http://localhost/register', {
        method: 'POST',
        body: formData,
      });

      const result = await callAction(request);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.errors.password).toBeDefined();
      expect(data.errors.password).toContain('8文字以上');
    });

    it('should return validation errors for short username', async () => {
      const formData = new FormData();
      formData.append('username', 'ab');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');

      const request = new Request('http://localhost/register', {
        method: 'POST',
        body: formData,
      });

      const result = await callAction(request);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.errors.username).toBeDefined();
      expect(data.errors.username).toContain('3文字以上');
    });

    it('should return error for duplicate email', async () => {
      // Create first user
      await userService.createUser({
        username: 'user1',
        email: 'test@example.com',
        password: 'password123',
      });

      // Try to create second user with same email
      const formData = new FormData();
      formData.append('username', 'user2');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password456');

      const request = new Request('http://localhost/register', {
        method: 'POST',
        body: formData,
      });

      const result = await callAction(request);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.errors.email).toBeDefined();
      expect(data.errors.email).toContain('既に使用されています');
    });
  });
});
