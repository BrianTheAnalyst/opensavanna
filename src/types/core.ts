
/**
 * Core type definitions for the application
 * Minimal, type-safe interfaces following security best practices
 */

export interface DataPoint {
  readonly id: string;
  readonly value: number;
  readonly timestamp: Date;
  readonly metadata?: Record<string, unknown>;
}

export interface ProcessingResult<T = unknown> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error?: string;
  readonly timestamp: Date;
}

export interface SecurityContext {
  readonly userId?: string;
  readonly permissions: readonly string[];
  readonly sessionId: string;
}
