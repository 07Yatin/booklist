import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Grid, Card, CardContent, CardActions, Typography, 
  AppBar, Toolbar, TextField, Button, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, Pagination, CircularProgress, Chip
} from '@mui/material';
import { Favorite as FavoriteIcon, Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { useSnackbar } from 'notistack';
import config from './config';

// Add CSS keyframes for gradient animation
const gradientAnimation = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Generate a demo userId for this session
const userId = 'demoUser' + Math.floor(Math.random() * 1000);
const role = 'reader';
const socket = io(config.SOCKET_URL, { query: { userId, role } });

function BookUserDashboard({ toggleTheme, mode }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const booksPerPage = 9;
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
         fetch(`${config.API_BASE_URL}/books`)
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
    return () => {
      socket.off('bookAdded');
      socket.off('bookUpdated');
      socket.off('bookDeleted');
      socket.off('favoriteUpdated');
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
  useEffect(() => { setPage(1); }, [search]);

  const handleFavorite = (bookId) => {
         fetch(`${config.API_BASE_URL}/books/${bookId}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  };

  // Function to format return date for display
  const formatReturnDate = (returnDateTime) => {
    if (!returnDateTime) return null;
    try {
      const date = new Date(returnDateTime);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return null;
    }
  };

  // Function to check if return date is overdue
  const isOverdue = (returnDateTime) => {
    if (!returnDateTime) return false;
    try {
      const returnDate = new Date(returnDateTime);
      const now = new Date();
      return returnDate < now;
    } catch (error) {
      return false;
    }
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      minHeight: '100vh' 
    }}>
      <style>{gradientAnimation}</style>
      {/* Main Content */}
      <AppBar 
        position="static" 
        sx={{
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 52, 96, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1,
              background: 'linear-gradient(45deg, #ffffff, #fff3e0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: '1.4rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                fontSize: '1.8rem',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
              }}
            >
              📚
            </Box>
            Real-time Book List
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f59e0b',
                    borderWidth: '2px',
                  },
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }}
              InputProps={{ style: { paddingRight: 0 } }}
            />
          </Box>
          <IconButton 
            sx={{ 
              ml: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
              }
            }} 
            color="inherit" 
            onClick={toggleTheme}
          >
            {mode === 'dark' ? <LightIcon /> : <DarkIcon />}
          </IconButton>
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
              {paginatedBooks.map(book => (
                <Grid item xs={12} sm={6} md={4} key={book.id} component={motion.div}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{ 
                      minHeight: 160, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between', 
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 220, 0.9) 50%, rgba(255, 243, 224, 0.95) 100%)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 12px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        borderColor: '#f59e0b',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 220, 0.95) 50%, rgba(255, 243, 224, 0.98) 100%)',
                        '& .card-overlay': {
                          opacity: 1,
                        },
                        '& .card-content': {
                          transform: 'translateY(-4px)',
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #f59e0b, #d97706, #f59e0b)',
                        backgroundSize: '200% 100%',
                        animation: 'gradientShift 3s ease infinite',
                      }
                    }}
                    onClick={() => { setBookDetails(book); setDetailsDialogOpen(true); }}
                  >
                    <CardContent 
                      className="card-content"
                      sx={{ 
                        p: 3,
                        transition: 'transform 0.3s ease',
                        '&:last-child': { pb: 2 }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          color: '#1a1a1a',
                          lineHeight: 1.3,
                          mb: 1
                        }}
                      >
                        {book.title}
                      </Typography>
                      <Typography 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: '#666',
                          fontStyle: 'italic'
                        }}
                      >
                        by {book.author}
                      </Typography>
                      {book.returnDateTime && (
                        <Typography
                          variant="body2"
                          color={isOverdue(book.returnDateTime) ? 'error' : 'text.secondary'}
                          sx={{ 
                            mt: 1,
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          📅 Return: {formatReturnDate(book.returnDateTime)}
                          {isOverdue(book.returnDateTime) && ' (Overdue)'}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mt: 0.5,
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        👤 Reader: {book.readerName || 'Not assigned'}
                      </Typography>
                    </CardContent>
                    <CardActions 
                      onClick={e => e.stopPropagation()}
                      sx={{ 
                        p: 2,
                        pt: 0,
                        justifyContent: 'center',
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%)'
                      }}
                    >
                      <IconButton 
                        onClick={() => handleFavorite(book.id)}
                        sx={{
                          background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                          color: 'white',
                          width: 40,
                          height: 40,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #ff5252, #d32f2f)',
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                          }
                        }}
                      >
                        <FavoriteIcon sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                      <Typography 
                        sx={{ 
                          ml: 1,
                          fontWeight: 600,
                          color: '#d32f2f',
                          fontSize: '0.9rem'
                        }}
                      >
                        {favorites[book.id] || 0}
                      </Typography>
                    </CardActions>
                    <Box 
                      className="card-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 203, 243, 0.1))',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                        borderRadius: '16px'
                      }}
                    />
                  </Card>
                </Grid>
              ))}
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
      {/* Book Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 220, 0.9) 50%, rgba(255, 243, 224, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            minWidth: '400px',
            maxWidth: '500px',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.3rem',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            '& .MuiTypography-root': {
              fontWeight: 700,
            }
          }}
        >
          Book Details
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 2 }}>
          {bookDetails && (
            <>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#1f2937',
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  textAlign: 'center',
                  mb: 2
                }}
              >
                {bookDetails.title}
              </Typography>
              <Typography 
                color="text.secondary" 
                gutterBottom 
                sx={{ 
                  color: '#6b7280',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}
              >
                by {bookDetails.author}
              </Typography>
              {bookDetails.returnDateTime && (
                <Typography
                  variant="body2"
                  color={isOverdue(bookDetails.returnDateTime) ? 'error' : 'text.secondary'}
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    mt: 1,
                    p: 2,
                    borderRadius: '8px',
                    background: isOverdue(bookDetails.returnDateTime) 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(16, 185, 129, 0.1)',
                    border: `1px solid ${isOverdue(bookDetails.returnDateTime) 
                      ? 'rgba(239, 68, 68, 0.3)' 
                      : 'rgba(16, 185, 129, 0.3)'}`
                  }}
                >
                  📅 Return Date: {formatReturnDate(bookDetails.returnDateTime)}
                  {isOverdue(bookDetails.returnDateTime) && (
                    <Box component="span" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
                      ⚠️ OVERDUE
                    </Box>
                  )}
                </Typography>
              )}
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 1,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                👤 Reader: {bookDetails.readerName || 'Not assigned'}
              </Typography>
              {/* Add more fields here in the future */}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
          <Button 
            onClick={() => setDetailsDialogOpen(false)}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              px: 4,
              py: 1,
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookUserDashboard; 