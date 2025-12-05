declare module "atomicShared/Button" {
  export interface ButtonProps {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
  }
  export const Button: React.FC<ButtonProps>;
}

declare module "atomicShared/Input" {
  export interface InputProps {
    type?: "text" | "email" | "password";
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    id?: string;
    name?: string;
    defaultValue?: string;
  }
  export const Input: React.FC<InputProps>;
}

declare module "atomicShared/Label" {
  export interface LabelProps {
    htmlFor?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
  }
  export const Label: React.FC<LabelProps>;
}

declare module "atomicShared/FormField" {
  export interface FormFieldProps {
    label: string;
    name: string;
    type?: "text" | "email" | "password";
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    defaultValue?: string;
  }
  export const FormField: React.FC<FormFieldProps>;
}

declare module "atomicShared/UserForm" {
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
  export interface UserCardProps {
    username: string;
    email: string;
    onEdit?: () => void;
    onDelete?: () => void;
  }
  export const UserCard: React.FC<UserCardProps>;
}

declare module "atomicShared/ConfirmDialog" {
  export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }
  export const ConfirmDialog: React.FC<ConfirmDialogProps>;
}
