/**
 * Utility Types
 */

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
