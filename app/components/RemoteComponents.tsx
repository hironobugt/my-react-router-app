import { lazy } from "react"
import { loadRemoteModule } from "~/utils/loadRemoteModule";

/**
 * Lazy-loaded remote components from Module Federation
 * These are loaded only on the client side to avoid SSR issues
 */

export const RemoteButton = lazy(() =>
  loadRemoteModule("./Button").then((m) => ({ default: m.Button }))
);

export const RemoteInput = lazy(() =>
  loadRemoteModule("./Input").then((m) => ({ default: m.Input }))
);

export const RemoteLabel = lazy(() =>
  loadRemoteModule("./Label").then((m) => ({ default: m.Label }))
);

export const RemoteFormField = lazy(() =>
  loadRemoteModule("./FormField").then((m) => ({ default: m.FormField }))
);

export const RemoteUserForm = lazy(() =>
  loadRemoteModule("./UserForm").then((m) => ({ default: m.UserForm }))
);

export const RemoteUserCard = lazy(() =>
  loadRemoteModule("./UserCard").then((m) => ({ default: m.UserCard }))
);

// Re-export types from type definitions
export type { ButtonProps } from "atomicShared/Button";
export type { InputProps } from "atomicShared/Input";
export type { LabelProps } from "atomicShared/Label";
export type { FormFieldProps } from "atomicShared/FormField";
export type { UserFormProps } from "atomicShared/UserForm";
export type { UserCardProps } from "atomicShared/UserCard";
