/**
 * Re-export Module Federation remote components for easier imports
 * Usage: import { Button, Input, UserForm } from '~/components/shared';
 * 
 * These components are lazy-loaded and should be wrapped in Suspense
 */

export {
  RemoteButton as Button,
  RemoteInput as Input,
  RemoteLabel as Label,
  RemoteFormField as FormField,
  RemoteUserForm as UserForm,
  RemoteUserCard as UserCard,
} from "./RemoteComponents";

export type {
  ButtonProps,
  InputProps,
  LabelProps,
  FormFieldProps,
  UserFormProps,
  UserCardProps,
} from "./RemoteComponents";

export type { UserFormValues } from "atomicShared/UserForm";

export { ClientOnly } from "./ClientOnly";
