/**
 * Type definitions for Module Federation remote components from atomic-shared
 */

declare module "atomicShared/Button" {
  import React from "react";

  export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    className?: string;
  }

  export const Button: React.FC<ButtonProps>;
}

declare module "atomicShared/Input" {
  import React from "react";

  export interface InputProps {
    type?: "text" | "email" | "password";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    id?: string;
    name?: string;
  }

  export const Input: React.FC<InputProps>;
}

declare module "atomicShared/Label" {
  import React from "react";

  export interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
    className?: string;
  }

  export const Label: React.FC<LabelProps>;
}

declare module "atomicShared/FormField" {
  import React from "react";

  export interface FormFieldProps {
    label: string;
    name: string;
    type?: "text" | "email" | "password";
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
  }

  export const FormField: React.FC<FormFieldProps>;
}

declare module "atomicShared/UserForm" {
  import React from "react";

  export interface UserFormValues {
    username: string;
    email: string;
    password?: string;
  }

  export interface UserFormProps {
    initialValues?: {
      username: string;
      email: string;
    };
    onSubmit: (values: UserFormValues) => void;
    submitLabel: string;
    errors?: Record<string, string>;
    showPassword?: boolean;
  }

  export const UserForm: React.FC<UserFormProps>;
}

declare module "atomicShared/UserCard" {
  import React from "react";

  export interface UserCardProps {
    user: {
      id: string;
      username: string;
      email: string;
      createdAt: string;
    };
    onEdit?: (userId: string) => void;
    onDelete?: (userId: string) => void;
    showActions?: boolean;
  }

  export const UserCard: React.FC<UserCardProps>;
}
