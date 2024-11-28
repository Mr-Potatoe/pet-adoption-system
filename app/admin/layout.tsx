'use client';

import { ReactNode, useState, useEffect } from 'react';
import NavBar from '@/components/admin/NavBar';
import Footer from '@/components/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface AdminLayoutProps {
  children: ReactNode; // This will render the page's content based on the route
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  // Load darkMode preference from localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false; // Default to light mode if no preference is found
  });

  // Update localStorage whenever darkMode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(darkMode));
    }
  }, [darkMode]);

  // Create themes for both dark and light modes
  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
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
        <main style={{ flex: 1 }}>{children}</main> {/* Makes content grow */}

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;
