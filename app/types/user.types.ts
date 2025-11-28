export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface CreateUserData {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
}
