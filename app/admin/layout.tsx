// app/admin/layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import NavBar from '@/components/admin/NavBar';
import Footer from '@/components/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';


interface AdminLayoutProps {
  children: ReactNode; // This will render the page's content based on the route
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <NavBar onToggleTheme={setDarkMode} />
      <main>{children}</main> {/* Dynamic content based on route */}
      <Footer darkMode={darkMode} />
    </ThemeProvider>
  );
};

export default AdminLayout;
