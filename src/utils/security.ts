
/**
 * Security utilities for input sanitization and validation
 * Production-ready security measures
 */

const SAFE_STRING_PATTERN = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
const MAX_INPUT_LENGTH = 1000;

/**
 * Sanitizes user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length === 0 || trimmed.length > MAX_INPUT_LENGTH) {
    return '';
  }
  
  // Remove potentially dangerous characters
  const cleaned = trimmed
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/[\x00-\x1f\x7f]/g, ''); // Remove control characters
  
  return SAFE_STRING_PATTERN.test(cleaned) ? cleaned : '';
}

/**
 * Validates numeric input with bounds checking
 */
export function validateNumber(
  value: unknown,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): number | null {
  const num = Number(value);
  
  if (!Number.isFinite(num) || num < min || num > max) {
    return null;
  }
  
  return num;
}

/**
 * Generates a cryptographically secure random ID
 */
export function generateSecureId(): string {
  return crypto.randomUUID();
}
