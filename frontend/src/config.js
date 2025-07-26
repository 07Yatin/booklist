// Configuration file for API endpoints
const config = {
  // Backend API URL - uses environment variable or defaults to localhost
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000',
  
  // Socket.io URL - uses environment variable or defaults to localhost
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000',
  
  // Environment detection
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API endpoints
  endpoints: {
    books: '/books',
    favorites: (bookId) => `/books/${bookId}/favorite`,
  }
};

export default config; 