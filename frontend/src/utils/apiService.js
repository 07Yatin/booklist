import config from '../config';
import { handleApiError } from './errorHandler';

// Centralized API service
class ApiService {
  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      return await handleApiError(response);
    } catch (error) {
      throw error;
    }
  }

  // Book operations
  async getBooks() {
    const response = await this.request('/books');
    return response.json();
  }

  async addBook(bookData) {
    const response = await this.request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
    return response.json();
  }

  async updateBook(id, bookData) {
    const response = await this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
    return response.json();
  }

  async deleteBook(id) {
    await this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleFavorite(bookId, userId) {
    const response = await this.request(`/books/${bookId}/favorite`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService; 