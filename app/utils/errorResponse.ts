import type { ValidationErrors } from "./validation";

/**
 * Standard error response format for all actions
 */
export interface ErrorResponse {
  success: false;
  errors: ValidationErrors | { general: string };
  message?: string;
}

/**
 * Standard success response format for all actions
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export type ActionResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  errors: ValidationErrors | string,
  statusCode: number = 400
): Response {
  const errorObj: ErrorResponse = {
    success: false,
    errors: typeof errors === "string" ? { general: errors } : errors,
  };

  return Response.json(errorObj, { status: statusCode });
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T = unknown>(
  data?: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: SuccessResponse<T> = {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
  };

  return Response.json(response, { status: statusCode });
}

/**
 * Handle database errors with appropriate logging and user-friendly messages
 */
export function handleDatabaseError(error: unknown, operation: string): Response {
  // Log the full error for debugging
  console.error(`Database error during ${operation}:`, error);

  // Return user-friendly error message
  return Response.json({
    success: false,
    errors: {
      general: "データベース処理中にエラーが発生しました。しばらくしてから再度お試しください。",
    },
  } as ErrorResponse, { status: 500 });
}

/**
 * Handle authentication errors
 */
export function createAuthError(message: string = "認証に失敗しました"): Response {
  return createErrorResponse({ general: message }, 401);
}

/**
 * Handle not found errors
 */
export function createNotFoundError(resource: string = "リソース"): Response {
  return createErrorResponse({ general: `${resource}が見つかりません` }, 404);
}

/**
 * Handle conflict errors (e.g., duplicate entries)
 */
export function createConflictError(message: string): Response {
  return createErrorResponse({ general: message }, 409);
}

/**
 * Handle validation errors
 */
export function createValidationError(errors: ValidationErrors): Response {
  return createErrorResponse(errors, 400);
}
