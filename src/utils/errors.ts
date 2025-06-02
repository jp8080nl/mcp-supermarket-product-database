/**
 * Custom error classes and error handling utilities
 */

export class DatabaseConnectionError extends Error {
  constructor(message: string = 'Database connection not available') {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with ID ${identifier} not found`
      : `${resource} not found`;
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Wrap an async function with standardized error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operation: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Handle Zod validation errors
      if (error && typeof error === 'object' && 'issues' in error) {
        interface ZodIssue {
          path: (string | number)[];
          message: string;
        }
        interface ZodError {
          issues: ZodIssue[];
        }
        const zodError = error as ZodError;
        const issues = zodError.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        throw new ValidationError(`Invalid input: ${issues}`);
      }

      // Handle database connection errors
      if (error instanceof Error) {
        if (error.message.includes('Database connection not available')) {
          throw new DatabaseConnectionError();
        }

        // Enhance error message with operation context
        throw new Error(`${operation} failed: ${error.message}`);
      }

      // Unknown error
      throw new Error(`${operation} failed: An unexpected error occurred`);
    }
  };
}
