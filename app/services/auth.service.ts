import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import type { User } from '../types/user.types';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export class AuthenticationService {
  private readonly SALT_ROUNDS = 10;

  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify a password against a hash
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  /**
   * Authenticate a user with email and password
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Find user with password hash
      const user = await userRepository.findByEmailWithPassword(email);

      if (!user) {
        return {
          success: false,
          error: 'メールアドレスまたはパスワードが正しくありません',
        };
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.passwordHash);

      if (!isPasswordValid) {
        return {
          success: false,
          error: 'メールアドレスまたはパスワードが正しくありません',
        };
      }

      // Return user without password hash
      const { passwordHash, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('Error during login:', error);
      return {
        success: false,
        error: 'ログイン処理中にエラーが発生しました',
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthenticationService();
