// layout.tsx

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import NavBar from '@/components/adopter/AdopterNav';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  // Save darkMode preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  return (
    <ThemeProvider
      theme={
        darkMode
          ? createTheme({ palette: { mode: 'dark' } })
          : createTheme({ palette: { mode: 'light' } })
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Full height of the viewport
        }}
      >
        {/* Navigation Bar */}
        <NavBar onToggleTheme={setDarkMode} />

        {/* Main Content */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1, // Ensures the container grows to fill space
            py: 2, // Adds vertical padding
          }}
        >
          {children}
        </Container>

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
