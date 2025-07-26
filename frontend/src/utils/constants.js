// Application constants
export const APP_CONSTANTS = {
  BOOKS_PER_PAGE: 6,
  SOCKET_EVENTS: {
    BOOK_ADDED: 'bookAdded',
    BOOK_UPDATED: 'bookUpdated',
    BOOK_DELETED: 'bookDeleted',
    FAVORITE_UPDATED: 'favoriteUpdated',
    USER_STATUS: 'userStatus',
    OWNER_JOIN: 'ownerJoinDashboard',
    OWNER_LEAVE: 'ownerLeaveDashboard',
    EDIT_UPDATE: 'editUpdate'
  },
  SNACKBAR_VARIANTS: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  },
  DATE_FORMATS: {
    DISPLAY: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  },
  VALIDATION: {
    MIN_TITLE_LENGTH: 1,
    MIN_AUTHOR_LENGTH: 1,
    MAX_TITLE_LENGTH: 200,
    MAX_AUTHOR_LENGTH: 100,
    MAX_READER_NAME_LENGTH: 50
  }
};

// User roles
export const USER_ROLES = {
  READER: 'reader',
  OWNER: 'owner'
};

// Default values
export const DEFAULT_VALUES = {
  NEW_BOOK: {
    title: '',
    author: '',
    returnDate: '',
    returnTime: '',
    readerName: ''
  },
  PAGINATION: {
    page: 1,
    booksPerPage: APP_CONSTANTS.BOOKS_PER_PAGE
  }
}; 