// Centralized error handling utility
export const handleError = (error, enqueueSnackbar, context = '') => {
  console.error(`Error in ${context}:`, error);
  
  const errorMessage = error?.message || 'An unexpected error occurred';
  enqueueSnackbar(errorMessage, { variant: 'error' });
  
  return errorMessage;
};

// API error handler
export const handleApiError = async (response, context = '') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response;
};

// Validation utilities
export const validateBookData = (bookData) => {
  const errors = [];
  
  if (!bookData.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!bookData.author?.trim()) {
    errors.push('Author is required');
  }
  
  if (bookData.returnDateTime) {
    const date = new Date(bookData.returnDateTime);
    if (isNaN(date.getTime())) {
      errors.push('Invalid return date/time format');
    }
  }
  
  return errors;
}; 