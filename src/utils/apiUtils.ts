
import { toast } from "@/hooks/use-toast";
import { useErrorContext } from '@/contexts/ErrorContext';

interface ApiErrorOptions {
  defaultMessage?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  severe?: boolean;
}

/**
 * Utility function to handle API errors in a consistent way
 */
export const handleApiError = (
  error: unknown, 
  options: ApiErrorOptions = {}
) => {
  const {
    defaultMessage = "Ein unerwarteter Fehler ist aufgetreten",
    showToast = true,
    logToConsole = true,
    severe = false
  } = options;
  
  // Extract error message
  let errorMessage = defaultMessage;
  let errorDetails = '';
  let errorCode = '';
  
  if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  } else if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    if (errorObj.message) errorMessage = errorObj.message;
    if (errorObj.details) errorDetails = errorObj.details;
    if (errorObj.code) errorCode = errorObj.code;
    if (errorObj.error) errorMessage = errorObj.error;
  }
  
  // Log to console in development
  if (logToConsole && process.env.NODE_ENV !== 'production') {
    console.error('[API Error]', error);
  }
  
  // Show toast notification
  if (showToast) {
    toast({
      variant: 'destructive',
      title: severe ? 'Schwerwiegender Fehler' : 'Fehler',
      description: errorMessage,
    });
  }
  
  return {
    message: errorMessage,
    details: errorDetails,
    code: errorCode,
    severity: severe ? 'critical' : 'error' as 'critical' | 'error'
  };
};

/**
 * React hook for handling API errors with ErrorContext integration
 */
export const useApiErrorHandler = () => {
  const { addError } = useErrorContext();
  
  return {
    handleError: (error: unknown, options: ApiErrorOptions = {}) => {
      const errorData = handleApiError(error, {
        ...options,
        showToast: false // Don't show toast since ErrorContext will do it
      });
      addError(errorData);
      return errorData;
    }
  };
};
