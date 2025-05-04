
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

export interface AppError {
  id: string;
  message: string;
  details?: string;
  code?: string;
  severity: 'warning' | 'error' | 'critical';
  timestamp: Date;
}

interface ErrorContextType {
  errors: AppError[];
  addError: (error: Omit<AppError, 'id' | 'timestamp'>) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = (error: Omit<AppError, 'id' | 'timestamp'>) => {
    const newError: AppError = {
      ...error,
      id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date()
    };

    setErrors((prevErrors) => [...prevErrors, newError]);

    // Show error toast for immediate feedback
    toast({
      variant: 'destructive',
      title: error.severity === 'critical' ? 'Kritischer Fehler' : 'Fehler',
      description: error.message,
    });

    // Log errors to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${error.severity.toUpperCase()}] ${error.message}`, error.details);
    }
  };

  const clearError = (id: string) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{ errors, addError, clearError, clearAllErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}
