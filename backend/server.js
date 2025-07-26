const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);

// CORS configuration for both development and production
const allowedOrigins = [
  'http://localhost:3000',  // Development
  'https://your-frontend-url.onrender.com',  // Production - update this
  process.env.FRONTEND_URL  // Environment variable
].filter(Boolean); // Remove undefined values

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// File storage for books
const BOOKS_FILE = path.join(__dirname, 'books.json');

// Load books from file
async function loadBooks() {
  try {
    const data = await fs.readFile(BOOKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing books file found, starting with empty array');
    return [];
  }
}

// Save books to file
async function saveBooks(books) {
  try {
    await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2));
    console.log('Books saved to file successfully');
  } catch (error) {
    console.error('Error saving books to file:', error);
  }
}

// Initialize books array
let books = [];

// Load books on server start
loadBooks().then(loadedBooks => {
  books = loadedBooks;
  console.log(`Loaded ${books.length} books from storage`);
});

let connectedOwners = 0;
let onlineUsers = [];

// REST endpoint to get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Add a new book
app.post('/books', async (req, res) => {
  const { title, author, returnDateTime, readerName } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  
  const newBook = {
    id: Date.now(),
    title,
    author,
    returnDateTime: returnDateTime || null,
    readerName: readerName || null,
    favorites: []
  };
  
  books.push(newBook);
  await saveBooks(books); // Save to file
  io.emit('bookAdded', newBook);
  emitDashboardStats();
  res.status(201).json(newBook);
});

// Update a book
app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, returnDateTime, readerName } = req.body;
  
  const bookIndex = books.findIndex(b => b.id == id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  const updatedBook = {
    ...books[bookIndex],
    title: title || books[bookIndex].title,
    author: author || books[bookIndex].author,
    returnDateTime: returnDateTime || null,
    readerName: readerName || null
  };
  
  books[bookIndex] = updatedBook;
  await saveBooks(books); // Save to file
  io.emit('bookUpdated', updatedBook);
  emitDashboardStats();
  res.json(updatedBook);
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex(b => b.id == id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  const deletedBook = books[bookIndex];
  books.splice(bookIndex, 1);
  await saveBooks(books); // Save to file
  io.emit('bookDeleted', deletedBook);
  emitDashboardStats();
  res.json({ message: 'Book deleted successfully' });
});

// Toggle favorite for a book
app.post('/books/:id/favorite', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const book = books.find(b => b.id == id);
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  if (!book.favorites) book.favorites = [];
  const idx = book.favorites.indexOf(userId);
  
  if (idx === -1) {
    book.favorites.push(userId);
  } else {
    book.favorites.splice(idx, 1);
  }
  
  await saveBooks(books); // Save to file
  io.emit('favoriteUpdated', { bookId: id, favoritesCount: book.favorites.length });
  emitDashboardStats();
  res.json({ favoritesCount: book.favorites.length });
});

// Socket.io connection
io.on('connection', (socket) => {
  // For demo, get user info from query or assign random
  const userId = socket.handshake.query.userId || `user_${Math.floor(Math.random() * 10000)}`;
  const role = socket.handshake.query.role || 'reader';

  onlineUsers.push({ id: userId, role, socketId: socket.id });
  io.emit('userStatus', onlineUsers);

  // For demo, treat all connections to owner dashboard as owners
  socket.on('ownerJoinDashboard', () => {
    connectedOwners++;
    emitDashboardStats();
  });
  socket.on('ownerLeaveDashboard', () => {
    connectedOwners = Math.max(0, connectedOwners - 1);
    emitDashboardStats();
  });
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(u => u.socketId !== socket.id);
    io.emit('userStatus', onlineUsers);
    // Optionally track disconnects if needed
  });
});

function emitDashboardStats() {
  const mostFavorited = books.reduce((max, b) =>
    (b.favorites && b.favorites.length > (max.favorites?.length || 0)) ? b : max, {});
  io.emit('dashboardStats', {
    bookCount: books.length,
    connectedOwners,
    mostFavorited: mostFavorited?.title || null,
    mostFavoritedCount: mostFavorited?.favorites?.length || 0
  });
}

// Call emitDashboardStats after any book/favorite change
// Add after add, delete, favorite endpoints:
// After adding a book:
// emitDashboardStats();
// After deleting a book:
// emitDashboardStats();
// After toggling favorite:
// emitDashboardStats();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
