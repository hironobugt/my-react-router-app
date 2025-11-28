import { randomBytes } from 'crypto';
import { userRepository } from '../repositories/user.repository';
import { authService } from './auth.service';
import { validateRegistration, validateProfileUpdate, type ValidationErrors } from '../utils/validation';
import type { User, UpdateUserData } from '../types/user.types';

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationErrors;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export class UserService {
  /**
   * Generate a unique user ID
   */
  private generateUserId(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserDto): Promise<ServiceResult<User>> {
    try {
      // Validate input
      const validationErrors = validateRegistration(data);
      if (validationErrors) {
        return {
          success: false,
          errors: validationErrors,
        };
      }

      // Check if email already exists
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        return {
          success: false,
          errors: {
            email: 'このメールアドレスは既に使用されています',
          },
        };
      }

      // Hash password
      const passwordHash = await authService.hashPassword(data.password);

      // Create user
      const user = await userRepository.create({
        id: this.generateUserId(),
        username: data.username,
        email: data.email,
        passwordHash,
      });

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        errors: {
          general: 'ユーザーの作成中にエラーが発生しました',
        },
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      return await userRepository.findById(id);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await userRepository.findByEmail(email);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await userRepository.findAll();
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, data: UpdateUserData): Promise<ServiceResult<User>> {
    try {
      // Validate input
      const validationErrors = validateProfileUpdate(data);
      if (validationErrors) {
        return {
          success: false,
          errors: validationErrors,
        };
      }

      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          errors: {
            general: 'ユーザーが見つかりません',
          },
        };
      }

      // Check if email is being changed and if it's already in use
      if (data.email && data.email !== existingUser.email) {
        const emailInUse = await userRepository.findByEmail(data.email);
        if (emailInUse) {
          return {
            success: false,
            errors: {
              email: 'このメールアドレスは既に使用されています',
            },
          };
        }
      }

      // Update user
      const updatedUser = await userRepository.update(id, data);

      return {
        success: true,
        data: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        errors: {
          general: 'ユーザーの更新中にエラーが発生しました',
        },
      };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<ServiceResult<void>> {
    try {
      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          errors: {
            general: 'ユーザーが見つかりません',
          },
        };
      }

      // Delete user (cascade will delete sessions)
      await userRepository.delete(id);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        errors: {
          general: 'ユーザーの削除中にエラーが発生しました',
        },
      };
    }
  }
}

// Export singleton instance
export const userService = new UserService();
