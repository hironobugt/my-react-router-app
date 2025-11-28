import { eq } from 'drizzle-orm';
import { db } from '../db';
import { sessions } from '../db/schema';
import { randomBytes } from 'crypto';

export interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

export class SessionService {
  private readonly SESSION_DURATION_HOURS = 24;

  /**
   * Generate a secure random session ID
   */
  private generateSessionId(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Create a new session for a user
   */
  async createSession(userId: string): Promise<Session> {
    try {
      const sessionId = this.generateSessionId();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.SESSION_DURATION_HOURS * 60 * 60 * 1000);

      const result = await db.insert(sessions).values({
        id: sessionId,
        userId,
        createdAt: now,
        expiresAt,
      }).returning();

      if (!result[0]) {
        throw new Error('Failed to create session');
      }

      return result[0];
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }
  }

  /**
   * Get a session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    try {
      const result = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId))
        .limit(1);

      if (!result[0]) {
        return null;
      }

      // Check if session is expired
      if (new Date() > result[0].expiresAt) {
        await this.deleteSession(sessionId);
        return null;
      }

      return result[0];
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete session');
    }
  }

  /**
   * Delete all sessions for a user
   */
  async deleteUserSessions(userId: string): Promise<void> {
    try {
      await db.delete(sessions).where(eq(sessions.userId, userId));
    } catch (error) {
      console.error('Error deleting user sessions:', error);
      throw new Error('Failed to delete user sessions');
    }
  }

  /**
   * Get session from request (cookie-based)
   */
  async getSessionFromRequest(request: Request): Promise<Session | null> {
    try {
      const cookieHeader = request.headers.get('Cookie');
      if (!cookieHeader) {
        return null;
      }

      // Parse session ID from cookie
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const sessionCookie = cookies.find(c => c.startsWith('sessionId='));
      
      if (!sessionCookie) {
        return null;
      }

      const sessionId = sessionCookie.split('=')[1];
      return await this.getSession(sessionId);
    } catch (error) {
      console.error('Error getting session from request:', error);
      return null;
    }
  }
}

// Export singleton instance
export const sessionService = new SessionService();
