/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import '@testing-library/jest-dom/vitest';
import Users, { loader } from '../users';
import { userService } from '~/services/user.service';
import { sessionService } from '~/services/session.service';
import type { User } from '~/types/user.types';

// Mock services
vi.mock('~/services/user.service', () => ({
  userService: {
    getAllUsers: vi.fn(),
    getUserById: vi.fn(),
  },
}));

vi.mock('~/services/session.service', () => ({
  sessionService: {
    getSessionFromRequest: vi.fn(),
  },
}));

// Mock remote components
vi.mock('~/components/shared', () => ({
  UserCard: ({ user, onEdit, onDelete }: any) => (
    <div data-testid={`user-card-${user.id}`}>
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit?.(user.id)}>編集</button>
      <button onClick={() => onDelete?.(user.id)}>削除</button>
    </div>
  ),
  ConfirmDialog: ({ isOpen, title, message, onConfirm, onCancel, confirmLabel, cancelLabel }: any) => (
    isOpen ? (
      <div data-testid="confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onConfirm}>{confirmLabel || '確認'}</button>
        <button onClick={onCancel}>{cancelLabel || 'キャンセル'}</button>
      </div>
    ) : null
  ),
  ClientOnly: ({ children }: any) => <>{typeof children === 'function' ? children() : children}</>,
}));

describe('Users Route', () => {
  const mockUsers: User[] = [
    {
      id: 'user-1',
      username: 'testuser1',
      email: 'test1@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'user-2',
      username: 'testuser2',
      email: 'test2@example.com',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 'user-3',
      username: 'testuser3',
      email: 'test3@example.com',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];

  const mockSession = {
    id: 'session-1',
    userId: 'user-1',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sessionService.getSessionFromRequest).mockResolvedValue(mockSession);
    vi.mocked(userService.getUserById).mockResolvedValue(mockUsers[0]);
  });

  it('should display all users', async () => {
    vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

    const router = createMemoryRouter(
      [
        {
          path: '/users',
          Component: Users,
          loader,
        },
      ],
      {
        initialEntries: ['/users'],
      }
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('ユーザー一覧')).toBeInTheDocument();
    });

    // Check that all users are displayed
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
      expect(screen.getByText('test1@example.com')).toBeInTheDocument();
      expect(screen.getByText('testuser2')).toBeInTheDocument();
      expect(screen.getByText('test2@example.com')).toBeInTheDocument();
      expect(screen.getByText('testuser3')).toBeInTheDocument();
      expect(screen.getByText('test3@example.com')).toBeInTheDocument();
    });
  });

  it('should display empty state when no users exist', async () => {
    vi.mocked(userService.getAllUsers).mockResolvedValue([]);

    const router = createMemoryRouter(
      [
        {
          path: '/users',
          Component: Users,
          loader,
        },
      ],
      {
        initialEntries: ['/users'],
      }
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('ユーザーが登録されていません')).toBeInTheDocument();
    });
  });

  it('should display loading state initially', async () => {
    vi.mocked(userService.getAllUsers).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockUsers), 100))
    );

    const router = createMemoryRouter(
      [
        {
          path: '/users',
          Component: Users,
          loader,
        },
      ],
      {
        initialEntries: ['/users'],
      }
    );

    render(<RouterProvider router={router} />);

    // The page should render with title even during loading
    await waitFor(() => {
      expect(screen.getByText('ユーザー一覧')).toBeInTheDocument();
    });
  });

  it('should call loader and fetch users', async () => {
    vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

    const request = new Request('http://localhost/users', {
      headers: {
        Cookie: 'sessionId=session-1',
      },
    });

    const result = await loader({ request, params: {}, context: {} });

    expect(userService.getAllUsers).toHaveBeenCalled();
    expect(result).toEqual({ users: mockUsers });
  });

  it('should show confirmation dialog when delete button is clicked', async () => {
    vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

    const router = createMemoryRouter(
      [
        {
          path: '/users',
          Component: Users,
          loader,
        },
      ],
      {
        initialEntries: ['/users'],
      }
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
    });

    // Click delete button on first user
    const deleteButtons = screen.getAllByText('削除');
    deleteButtons[0].click();

    // Confirmation dialog should appear
    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      expect(screen.getByText('ユーザーの削除')).toBeInTheDocument();
      expect(screen.getByText(/この操作は取り消せません/)).toBeInTheDocument();
    });
  });

  it('should close confirmation dialog when cancel is clicked', async () => {
    vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

    const router = createMemoryRouter(
      [
        {
          path: '/users',
          Component: Users,
          loader,
        },
      ],
      {
        initialEntries: ['/users'],
      }
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByText('削除');
    deleteButtons[0].click();

    // Dialog should appear
    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });

    // Click cancel
    const cancelButton = screen.getByText('キャンセル');
    cancelButton.click();

    // Dialog should disappear
    await waitFor(() => {
      expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
    });
  });

  it('should remove user from list when delete is confirmed', async () => {
    vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

    const router = createMemoryRouter(
      [
        {
          path: '/users',
          Component: Users,
          loader,
        },
        {
          path: '/delete-user',
          action: async () => ({ success: true }),
        },
      ],
      {
        initialEntries: ['/users'],
      }
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
    });

    // Click delete button on first user
    const deleteButtons = screen.getAllByText('削除');
    deleteButtons[0].click();

    // Confirm deletion
    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });

    // Get all delete buttons again (now includes the one in the dialog)
    const allDeleteButtons = screen.getAllByText('削除');
    // The last one should be the confirm button in the dialog
    const confirmButton = allDeleteButtons[allDeleteButtons.length - 1];
    confirmButton.click();

    // User should be removed from the list
    await waitFor(() => {
      expect(screen.queryByText('testuser1')).not.toBeInTheDocument();
    });

    // Other users should still be visible
    expect(screen.getByText('testuser2')).toBeInTheDocument();
    expect(screen.getByText('testuser3')).toBeInTheDocument();
  });
});
