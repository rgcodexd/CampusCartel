export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class ValidationError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string = 'VALIDATION_ERROR', details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends Error {
  code: string;
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'NetworkError';
    this.code = 'NETWORK_ERROR';
    this.status = status;
  }
}

export class FirebaseError extends Error {
  code: string;
  firebaseCode?: string;

  constructor(message: string, firebaseCode?: string) {
    super(message);
    this.name = 'FirebaseError';
    this.code = 'FIREBASE_ERROR';
    this.firebaseCode = firebaseCode;
  }
}

export const handleError = (error: any): AppError => {
  console.error('Error occurred:', error);

  // Handle known error types
  if (error instanceof ValidationError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof NetworkError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  // Handle Firebase errors
  if (error.code && error.code.startsWith('auth/')) {
    return {
      code: 'AUTH_ERROR',
      message: getFirebaseAuthErrorMessage(error.code),
    };
  }

  if (error.code && error.code.startsWith('firestore/')) {
    return {
      code: 'FIRESTORE_ERROR',
      message: getFirestoreErrorMessage(error.code),
    };
  }

  // Handle network errors
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed. Please check your internet connection.',
    };
  }

  // Handle generic errors
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred. Please try again.',
  };
};

export const getFirebaseAuthErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/operation-not-allowed': 'This operation is not allowed.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  };

  return messages[code] || 'Authentication failed. Please try again.';
};

export const getFirestoreErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    'firestore/permission-denied': 'You do not have permission to perform this action.',
    'firestore/unavailable': 'Service is temporarily unavailable. Please try again later.',
    'firestore/deadline-exceeded': 'Request timed out. Please try again.',
    'firestore/resource-exhausted': 'Service quota exceeded. Please try again later.',
    'firestore/failed-precondition': 'Operation failed due to a precondition not being met.',
    'firestore/aborted': 'Operation was aborted. Please try again.',
    'firestore/out-of-range': 'Operation is out of valid range.',
    'firestore/unimplemented': 'Operation is not implemented.',
    'firestore/internal': 'Internal error occurred. Please try again.',
    'firestore/data-loss': 'Data loss occurred. Please try again.',
  };

  return messages[code] || 'Database operation failed. Please try again.';
};

export const showErrorAlert = (error: AppError, title: string = 'Error') => {
  // This would integrate with your alert system
  // For now, we'll just log it
  console.error(`${title}: ${error.message}`);
  
  // In a real app, you might use:
  // Alert.alert(title, error.message);
};

export const isRetryableError = (error: AppError): boolean => {
  const retryableCodes = [
    'NETWORK_ERROR',
    'firestore/unavailable',
    'firestore/deadline-exceeded',
    'firestore/resource-exhausted',
    'firestore/aborted',
    'firestore/internal',
  ];

  return retryableCodes.indexOf(error.code) !== -1;
};

export const getErrorMessage = (error: any): string => {
  const appError = handleError(error);
  return appError.message;
}; 