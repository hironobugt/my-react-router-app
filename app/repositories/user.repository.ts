import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import type { User, UserWithPassword, CreateUserData, UpdateUserData } from '../types/user.types';

export class UserRepository {
  /**
   * Create a new user
   */
  async create(data: CreateUserData): Promise<User> {
    try {
      const now = new Date();
      
      const result = await db.insert(users).values({
        id: data.id,
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        createdAt: now,
        updatedAt: now,
      }).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

      if (!result[0]) {
        throw new Error('Failed to create user');
      }

      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user in database');
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const result = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user in database');
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user in database');
    }
  }

  /**
   * Find user by email with password hash (for authentication)
   */
  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    try {
      const result = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          passwordHash: users.passwordHash,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by email with password:', error);
      throw new Error('Failed to find user in database');
    }
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    try {
      const result = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users);

      return result;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error('Failed to retrieve users from database');
    }
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserData): Promise<User> {
    try {
      const updateData: any = {
        ...data,
        updatedAt: new Date(),
      };

      const result = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });

      if (!result[0]) {
        throw new Error('User not found');
      }

      return result[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user in database');
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    try {
      const result = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id });

      if (!result[0]) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user from database');
    }
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
