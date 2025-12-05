import { lazy } from "react"
import { loadRemoteModule } from "~/utils/loadRemoteModule";
import type { ButtonProps } from "atomicShared/Button";
import type { InputProps } from "atomicShared/Input";
import type { LabelProps } from "atomicShared/Label";
import type { FormFieldProps } from "atomicShared/FormField";
import type { UserFormProps } from "atomicShared/UserForm";
import type { UserCardProps } from "atomicShared/UserCard";
import type { ConfirmDialogProps } from "atomicShared/ConfirmDialog";

/**
 * Lazy-loaded remote components from Module Federation
 * These are loaded only on the client side to avoid SSR issues
 */

export const RemoteButton = lazy(() =>
  loadRemoteModule("./Button").then((m) => ({ default: m.Button }))
) as React.LazyExoticComponent<React.FC<ButtonProps>>;

export const RemoteInput = lazy(() =>
  loadRemoteModule("./Input").then((m) => ({ default: m.Input }))
) as React.LazyExoticComponent<React.FC<InputProps>>;

export const RemoteLabel = lazy(() =>
  loadRemoteModule("./Label").then((m) => ({ default: m.Label }))
) as React.LazyExoticComponent<React.FC<LabelProps>>;

export const RemoteFormField = lazy(() =>
  loadRemoteModule("./FormField").then((m) => ({ default: m.FormField }))
) as React.LazyExoticComponent<React.FC<FormFieldProps>>;

export const RemoteUserForm = lazy(() =>
  loadRemoteModule("./UserForm").then((m) => ({ default: m.UserForm }))
) as React.LazyExoticComponent<React.FC<UserFormProps>>;

export const RemoteUserCard = lazy(() =>
  loadRemoteModule("./UserCard").then((m) => ({ default: m.UserCard }))
) as React.LazyExoticComponent<React.FC<UserCardProps>>;

export const RemoteConfirmDialog = lazy(() =>
  loadRemoteModule("./ConfirmDialog").then((m) => ({ default: m.ConfirmDialog }))
) as React.LazyExoticComponent<React.FC<ConfirmDialogProps>>;

// Re-export types
export type { ButtonProps, InputProps, LabelProps, FormFieldProps, UserFormProps, UserCardProps, ConfirmDialogProps };
