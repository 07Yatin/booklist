import React, { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Box,
  CssBaseline,
  useMediaQuery,
  Pagination,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import BookOwnerDashboardWithSnackbar from './BookOwnerDashboard';
import BookUserDashboardWithSnackbar from './BookUserDashboard';

// Generate a demo userId for this session
const userId = 'demoUser' + Math.floor(Math.random() * 1000);
const role = 'reader';
const socket = io('http://localhost:4000', { query: { userId, role } });

function BookList({ toggleTheme, mode }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const booksPerPage = 9;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [editBook, setEditBook] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({}); // { [bookId]: count }
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/books')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then(setBooks)
      .catch(err => {
        setError(err.message);
        enqueueSnackbar(err.message, { variant: 'error' });
      })
      .finally(() => setLoading(false));

    socket.on('bookAdded', (book) => {
      setBooks(prev => [...prev, book]);
      enqueueSnackbar(`Book added: ${book.title}`, { variant: 'success' });
    });
    socket.on('bookUpdated', (book) => {
      setBooks(prev => prev.map(b => b.id === book.id ? book : b));
      enqueueSnackbar(`Book updated: ${book.title}`, { variant: 'info' });
    });
    socket.on('bookDeleted', (book) => {
      setBooks(prev => prev.filter(b => b.id !== book.id));
      enqueueSnackbar(`Book deleted: ${book.title}`, { variant: 'warning' });
    });
    socket.on('favoriteUpdated', ({ bookId, favoritesCount }) => {
      setFavorites(prev => ({ ...prev, [bookId]: favoritesCount }));
    });
    socket.on('userStatus', setOnlineUsers);
    return () => {
      socket.off('bookAdded');
      socket.off('bookUpdated');
      socket.off('bookDeleted');
      socket.off('favoriteUpdated');
      socket.off('userStatus');
    };
    // eslint-disable-next-line
  }, []);

  // Filter books by search
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const pageCount = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice((page - 1) * booksPerPage, page * booksPerPage);

  // Reset to page 1 when search changes
  React.useEffect(() => { setPage(1); }, [search]);

  const handleAddBook = (e) => {
    e.preventDefault();
    setActionLoading(true);
    fetch('http://localhost:4000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add book');
        return res.json();
      })
      .then(() => {
        setNewBook({ title: '', author: '' });
        setDialogOpen(false);
      })
      .catch(err => {
        setError(err.message);
        enqueueSnackbar(err.message, { variant: 'error' });
      })
      .finally(() => setActionLoading(false));
  };

  const handleEditBook = (e) => {
    e.preventDefault();
    setActionLoading(true);
    fetch(`http://localhost:4000/books/${editBook.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editBook)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update book');
        return res.json();
      })
      .then(() => {
        setEditBook(null);
        setEditDialogOpen(false);
      })
      .catch(err => {
        setError(err.message);
        enqueueSnackbar(err.message, { variant: 'error' });
      })
      .finally(() => setActionLoading(false));
  };

  const handleDeleteBook = () => {
    setActionLoading(true);
    fetch(`http://localhost:4000/books/${bookToDelete.id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete book');
      })
      .then(() => {
        setDeleteDialogOpen(false);
        setBookToDelete(null);
      })
      .catch(err => {
        setError(err.message);
        enqueueSnackbar(err.message, { variant: 'error' });
      })
      .finally(() => setActionLoading(false));
  };

  const handleFavorite = (bookId) => {
    fetch(`http://localhost:4000/books/${bookId}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demoUser' }) // Replace with real user ID
    });
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', display: 'flex' }}>
      {/* Online Users Sidebar */}
      <Box sx={{ width: 220, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', p: 2, display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6">Online Users</Typography>
        <ul style={{ paddingLeft: 16 }}>
          {onlineUsers.map(u => (
            <li key={u.id}>{u.id} ({u.role})</li>
          ))}
        </ul>
      </Box>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              📚 Real-time Book List
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 2 }}>
              <SearchIcon sx={{ mr: 1 }} />
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ bgcolor: 'background.paper', borderRadius: 1, minWidth: 180 }}
                InputProps={{ style: { paddingRight: 0 } }}
              />
            </Box>
            <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button color="inherit" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              Add Book
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4, minHeight: 300 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                <AnimatePresence>
                  {paginatedBooks.map(book => (
                    <Grid item xs={12} sm={6} md={4} key={book.id} component={motion.div}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                        onClick={() => { setBookDetails(book); setDetailsDialogOpen(true); }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>{book.title}</Typography>
                          <Typography color="text.secondary">by {book.author}</Typography>
                        </CardContent>
                        <CardActions onClick={e => e.stopPropagation()}>
                          <IconButton color="primary" onClick={() => { setEditBook(book); setEditDialogOpen(true); }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => { setBookToDelete(book); setDeleteDialogOpen(true); }}>
                            <DeleteIcon />
                          </IconButton>
                          <IconButton onClick={() => handleFavorite(book.id)}>
                            <FavoriteIcon color="error" />
                            <span style={{ marginLeft: 4 }}>{favorites[book.id] || 0}</span>
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
              {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
        {/* Add Book Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Add New Book</DialogTitle>
          <form onSubmit={handleAddBook}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                value={newBook.title}
                onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                required
                disabled={actionLoading}
              />
              <TextField
                margin="dense"
                label="Author"
                fullWidth
                value={newBook.author}
                onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                required
                disabled={actionLoading}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={actionLoading}>
                {actionLoading ? <CircularProgress size={24} /> : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* Edit Book Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Book</DialogTitle>
          {editBook && (
            <form onSubmit={handleEditBook}>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Title"
                  fullWidth
                  value={editBook.title}
                  onChange={e => setEditBook({ ...editBook, title: e.target.value })}
                  required
                  disabled={actionLoading}
                />
                <TextField
                  margin="dense"
                  label="Author"
                  fullWidth
                  value={editBook.author}
                  onChange={e => setEditBook({ ...editBook, author: e.target.value })}
                  required
                  disabled={actionLoading}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={actionLoading}>
                  {actionLoading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </DialogActions>
            </form>
          )}
        </Dialog>
        {/* Delete Book Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Book</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete <b>{bookToDelete?.title}</b>?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button onClick={handleDeleteBook} color="error" variant="contained" disabled={actionLoading}>
              {actionLoading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Book Details Dialog */}
        <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)}>
          <DialogTitle>Book Details</DialogTitle>
          <DialogContent>
            {bookDetails && (
              <>
                <Typography variant="h6" gutterBottom>{bookDetails.title}</Typography>
                <Typography color="text.secondary" gutterBottom>by {bookDetails.author}</Typography>
                {/* Add more fields here in the future */}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

function BookOwnerDashboard() {
  const [stats, setStats] = useState({ bookCount: 0, connectedOwners: 0, mostFavorited: '', mostFavoritedCount: 0 });

  useEffect(() => {
    socket.emit('ownerJoinDashboard');
    socket.on('dashboardStats', setStats);
    return () => {
      socket.emit('ownerLeaveDashboard');
      socket.off('dashboardStats');
    };
  }, []);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Book Owner Dashboard</Typography>
      <Typography>Books in system: <b>{stats.bookCount}</b></Typography>
      <Typography>Owners viewing dashboard: <b>{stats.connectedOwners}</b></Typography>
      <Typography>
        Most favorited book: <b>{stats.mostFavorited || 'N/A'}</b>
        {stats.mostFavorited ? ` (${stats.mostFavoritedCount} favorites)` : ''}
      </Typography>
    </Box>
  );
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(() => (prefersDarkMode ? 'dark' : 'light'));
  const theme = useMemo(() => createTheme({ palette: { mode, /* ... */ } }), [mode]);
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  const [roleTab, setRoleTab] = useState(0); // 0: Reader, 1: Owner

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={2500} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Box sx={{ 
          width: '100%', 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #f59e0b, #d97706, #f59e0b)',
            backgroundSize: '200% 100%',
            animation: 'gradientShift 3s ease infinite',
          }
        }}>
          <style>{`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes tabGlow {
              0%, 100% { box-shadow: 0 0 5px rgba(245, 158, 11, 0.3); }
              50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); }
            }
          `}</style>
          <Tabs 
            value={roleTab} 
            onChange={(_, v) => setRoleTab(v)} 
            centered
            sx={{
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                height: '3px',
                borderRadius: '2px',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
              },
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'none',
                minHeight: '60px',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-2px)',
                },
                '&.Mui-selected': {
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  animation: 'tabGlow 2s ease-in-out infinite',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '0',
                  height: '0',
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  zIndex: -1,
                },
                '&:hover::before': {
                  width: '120px',
                  height: '120px',
                },
                '&.Mui-selected::before': {
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
                }
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ fontSize: '1.3rem' }}>📚</Box>
                  Book Reader
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ fontSize: '1.3rem' }}>👑</Box>
                  Book Owner
                </Box>
              } 
            />
          </Tabs>
        </Box>
        {roleTab === 0 && <BookUserDashboardWithSnackbar toggleTheme={toggleTheme} mode={mode} />}
        {roleTab === 1 && <BookOwnerDashboardWithSnackbar />}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
