/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import RegisterFormClient from '../RegisterFormClient';

// Mock React Router Form component
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  };
});

// Mock RemoteComponents with federated mocks
vi.mock('../RemoteComponents', () => {
  // Use require for CommonJS modules
  const { FormField } = require('../../../__mocks__/@mf/atomicShared/FormField.cjs');
  const { Button } = require('../../../__mocks__/@mf/atomicShared/Button.cjs');
  
  return {
    RemoteFormField: FormField,
    RemoteButton: Button,
  };
});

describe('RegisterFormClient', () => {
  it('should render form with correct button label "登録"', () => {
    render(<RegisterFormClient errors={{}} isSubmitting={false} />);

    // Check button label
    const submitButton = screen.getByRole('button', { name: '登録' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it('should render all form fields with correct labels', () => {
    render(<RegisterFormClient errors={{}} isSubmitting={false} />);

    // Labels include required asterisk from atomic-shared components
    expect(screen.getByLabelText(/ユーザー名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
  });

  it('should show "登録中..." when submitting', () => {
    render(<RegisterFormClient errors={{}} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: '登録中...' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should display validation errors', () => {
    const errors = {
      username: 'ユーザー名は3文字以上で入力してください',
      email: '有効なメールアドレスを入力してください',
      password: 'パスワードは8文字以上で入力してください',
    };

    render(<RegisterFormClient errors={errors} isSubmitting={false} />);

    expect(screen.getByText(errors.username)).toBeInTheDocument();
    expect(screen.getByText(errors.email)).toBeInTheDocument();
    expect(screen.getByText(errors.password)).toBeInTheDocument();
  });

  it('should have correct form method', () => {
    const { container } = render(<RegisterFormClient errors={{}} isSubmitting={false} />);
    
    const form = container.querySelector('form');
    expect(form).toHaveAttribute('method', 'post');
  });
});
