'use client';

import { Box, Typography, Container, Link, createTheme, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Footer = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Sync theme with localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches));
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          padding: '1rem 0',
          mt: 'auto',
          position: 'relative',
          bottom: 0,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} Your Company. All Rights Reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            <Link href="/privacy" color="inherit" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            |
            <Link href="/terms" color="inherit" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
