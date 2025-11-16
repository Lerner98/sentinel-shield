export class AppError extends Error {
  code?: string;
  statusCode?: number;
  isOperational: boolean;
  originalError?: Error;

  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      isOperational?: boolean;
      originalError?: Error;
    }
  ) {
    super(message);
    this.name = "AppError";
    this.code = options?.code;
    this.statusCode = options?.statusCode || 500;
    this.isOperational = options?.isOperational ?? true;
    this.originalError = options?.originalError;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, { code, statusCode: 400 });
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, { statusCode: 401 });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, { statusCode: 403 });
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, { statusCode: 404 });
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, { statusCode: 429 });
    this.name = "RateLimitError";
  }
}

export class StorageQuotaError extends AppError {
  constructor(message: string = "Storage quota exceeded") {
    super(message, { statusCode: 507 });
    this.name = "StorageQuotaError";
  }
}
