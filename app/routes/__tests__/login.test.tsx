/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import '@testing-library/jest-dom/vitest';
import Login, { action } from '../login';
import { authService } from '~/services/auth.service';
import { sessionService } from '~/services/session.service';

// Mock services
vi.mock('~/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}));

vi.mock('~/services/session.service', () => ({
  sessionService: {
    createSession: vi.fn(),
  },
}));

describe('Login Route', () => {
  it('should render login form', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/login',
          Component: Login,
        },
      ],
      {
        initialEntries: ['/login'],
      }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('アカウントにログイン')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
  });

  it('should display authentication error on invalid credentials', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      success: false,
      error: 'メールアドレスまたはパスワードが正しくありません',
    });

    const router = createMemoryRouter(
      [
        {
          path: '/login',
          Component: Login,
          action,
        },
      ],
      {
        initialEntries: ['/login'],
      }
    );

    render(<RouterProvider router={router} />);

    const emailInput = screen.getByPlaceholderText('メールアドレス');
    const passwordInput = screen.getByPlaceholderText('パスワード');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('メールアドレスまたはパスワードが正しくありません')).toBeInTheDocument();
    });
  });

  it('should submit form with email and password', async () => {
    const mockUser = {
      id: 'user-1',
      username: 'testuser',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockSession = {
      id: 'session-1',
      userId: 'user-1',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    vi.mocked(authService.login).mockResolvedValue({
      success: true,
      user: mockUser,
    });

    vi.mocked(sessionService.createSession).mockResolvedValue(mockSession);

    const router = createMemoryRouter(
      [
        {
          path: '/login',
          Component: Login,
          action,
        },
        {
          path: '/dashboard',
          Component: () => <div>Dashboard</div>,
        },
      ],
      {
        initialEntries: ['/login'],
      }
    );

    render(<RouterProvider router={router} />);

    const emailInput = screen.getByPlaceholderText('メールアドレス');
    const passwordInput = screen.getByPlaceholderText('パスワード');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(sessionService.createSession).toHaveBeenCalledWith('user-1');
    });
  });
});
