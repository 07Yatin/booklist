import React, { useState } from 'react';
import { ThemeProvider, createTheme, useMediaQuery, CssBaseline, Box, Tabs, Tab } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import BookUserDashboard from './BookUserDashboard';
import BookOwnerDashboard from './BookOwnerDashboard';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(() => (prefersDarkMode ? 'dark' : 'light'));
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });
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
        {roleTab === 0 && <BookUserDashboard toggleTheme={toggleTheme} mode={mode} />}
        {roleTab === 1 && <BookOwnerDashboard toggleTheme={toggleTheme} mode={mode} />}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
