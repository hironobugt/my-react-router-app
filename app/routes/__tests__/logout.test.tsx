import { describe, it, expect, beforeEach, vi } from 'vitest';
import { action } from '../logout';
import { sessionService } from '~/services/session.service';

// Mock the session service
vi.mock('~/services/session.service', () => ({
  sessionService: {
    getSessionFromRequest: vi.fn(),
    deleteSession: vi.fn(),
  },
}));

describe('Logout Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('action', () => {
    it('should delete session and redirect to login', async () => {
      const mockSession = {
        id: 'session-123',
        userId: 'user-123',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      vi.mocked(sessionService.getSessionFromRequest).mockResolvedValue(mockSession);
      vi.mocked(sessionService.deleteSession).mockResolvedValue();

      const request = new Request('http://localhost/logout', {
        method: 'POST',
        headers: {
          Cookie: 'sessionId=session-123',
        },
      });

      const response = await action({ request, params: {}, context: {} });

      // Should delete the session
      expect(sessionService.getSessionFromRequest).toHaveBeenCalledWith(request);
      expect(sessionService.deleteSession).toHaveBeenCalledWith('session-123');

      // Should redirect to login
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('/login');

      // Should clear session cookie
      const setCookie = response.headers.get('Set-Cookie');
      expect(setCookie).toContain('sessionId=');
      expect(setCookie).toContain('Max-Age=0');
    });

    it('should handle logout when no session exists', async () => {
      vi.mocked(sessionService.getSessionFromRequest).mockResolvedValue(null);

      const request = new Request('http://localhost/logout', {
        method: 'POST',
      });

      const response = await action({ request, params: {}, context: {} });

      // Should not try to delete session
      expect(sessionService.deleteSession).not.toHaveBeenCalled();

      // Should still redirect to login
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('/login');
    });
  });
});
