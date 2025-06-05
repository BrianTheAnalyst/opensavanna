
/**
 * Secure input component with built-in validation and sanitization
 * Production-ready form input with security measures
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sanitizeInput, validateNumber } from '@/utils/security';
import { debounce } from '@/utils/performance';

interface SecureInputProps {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  className?: string;
  'aria-describedby'?: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  maxLength = 1000,
  min,
  max,
  className,
  'aria-describedby': ariaDescribedBy
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  
  // Debounced validation to improve performance
  const debouncedValidation = useMemo(
    () => debounce((inputValue: string) => {
      setError(null);
      
      if (required && !inputValue.trim()) {
        setError(`${label} is required`);
        return;
      }
      
      if (type === 'number') {
        const numValue = validateNumber(inputValue, min, max);
        if (inputValue && numValue === null) {
          setError(`Please enter a valid number${min !== undefined || max !== undefined ? ` between ${min ?? '-∞'} and ${max ?? '∞'}` : ''}`);
          return;
        }
      }
      
      if (type === 'email' && inputValue) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(inputValue)) {
          setError('Please enter a valid email address');
          return;
        }
      }
    }, 300),
    [label, type, required, min, max]
  );
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    // Sanitize input
    const sanitizedValue = type === 'number' ? inputValue : sanitizeInput(inputValue);
    
    // Length validation
    if (sanitizedValue.length > maxLength) {
      setError(`${label} cannot exceed ${maxLength} characters`);
      return;
    }
    
    // Update value
    if (type === 'number') {
      const numValue = validateNumber(sanitizedValue, min, max);
      onChange(numValue ?? 0);
    } else {
      onChange(sanitizedValue);
    }
    
    // Validate after change
    debouncedValidation(sanitizedValue);
  }, [type, maxLength, label, min, max, onChange, debouncedValidation]);
  
  const handleBlur = useCallback(() => {
    setIsTouched(true);
    debouncedValidation(String(value));
  }, [value, debouncedValidation]);
  
  const inputId = `secure-input-${id}`;
  const errorId = `${inputId}-error`;
  const hasError = isTouched && error;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Input
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
        className={`${className} ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : ariaDescribedBy}
        autoComplete="off"
      />
      
      {hasError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription id={errorId} className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
