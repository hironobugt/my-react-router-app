export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password requirements
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Validate username requirements
 */
export function isValidUsername(username: string): boolean {
  return username.length >= 3;
}

/**
 * Validate user registration data
 */
export function validateRegistration(data: {
  username: string;
  email: string;
  password: string;
}): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (!data.username || !isValidUsername(data.username)) {
    errors.username = 'ユーザー名は3文字以上である必要があります';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.password = 'パスワードは8文字以上である必要があります';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validate user profile update data
 */
export function validateProfileUpdate(data: {
  username?: string;
  email?: string;
}): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (data.username !== undefined && !isValidUsername(data.username)) {
    errors.username = 'ユーザー名は3文字以上である必要があります';
  }

  if (data.email !== undefined && !isValidEmail(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
