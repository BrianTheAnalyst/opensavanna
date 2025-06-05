
/**
 * Secure state management hook with validation
 * Production-ready state handling with security considerations
 */

import { useState, useCallback, useMemo } from 'react';
import { sanitizeInput, validateNumber } from '@/utils/security';
import type { ProcessingResult, SecurityContext } from '@/types/core';

interface SecureStateOptions<T> {
  validator?: (value: T) => boolean;
  sanitizer?: (value: unknown) => T;
  maxHistory?: number;
}

export function useSecureState<T>(
  initialValue: T,
  options: SecureStateOptions<T> = {}
) {
  const { validator, sanitizer, maxHistory = 10 } = options;
  
  const [state, setState] = useState<T>(initialValue);
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [error, setError] = useState<string | null>(null);
  
  const updateState = useCallback((newValue: unknown): ProcessingResult<T> => {
    try {
      setError(null);
      
      // Sanitize input if sanitizer provided
      const sanitized = sanitizer ? sanitizer(newValue) : newValue as T;
      
      // Validate input if validator provided
      if (validator && !validator(sanitized)) {
        const errorMsg = 'Invalid input value';
        setError(errorMsg);
        return {
          success: false,
          data: null,
          error: errorMsg,
          timestamp: new Date()
        };
      }
      
      setState(sanitized);
      
      // Update history with memory management
      setHistory(prev => {
        const newHistory = [sanitized, ...prev];
        return newHistory.slice(0, maxHistory);
      });
      
      return {
        success: true,
        data: sanitized,
        timestamp: new Date()
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        data: null,
        error: errorMsg,
        timestamp: new Date()
      };
    }
  }, [validator, sanitizer, maxHistory]);
  
  const revert = useCallback(() => {
    if (history.length > 1) {
      const previousValue = history[1];
      setState(previousValue);
      setHistory(prev => prev.slice(1));
    }
  }, [history]);
  
  const reset = useCallback(() => {
    setState(initialValue);
    setHistory([initialValue]);
    setError(null);
  }, [initialValue]);
  
  return useMemo(() => ({
    value: state,
    update: updateState,
    revert,
    reset,
    error,
    history: history.slice(0, 5), // Limit exposed history
    hasHistory: history.length > 1
  }), [state, updateState, revert, reset, error, history]);
}

// Specialized hooks for common use cases
export function useSecureStringState(initialValue = '') {
  return useSecureState(initialValue, {
    sanitizer: sanitizeInput,
    validator: (value: string) => value.length <= 1000
  });
}

export function useSecureNumberState(initialValue = 0, min?: number, max?: number) {
  return useSecureState(initialValue, {
    sanitizer: (value: unknown) => validateNumber(value, min, max) ?? initialValue,
    validator: (value: number) => Number.isFinite(value)
  });
}
