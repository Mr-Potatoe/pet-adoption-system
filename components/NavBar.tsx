'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Button, IconButton, Stack, Drawer, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { LightMode, DarkMode, Menu, Pets, Group, ManageSearch, ExitToApp } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define light and dark theme configurations
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

const NavBar = ({ onToggleTheme }: { onToggleTheme: (darkMode: boolean) => void }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);  // State for the logout confirmation modal
  const router = useRouter();

  // Sync theme with localStorage and HTML class
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // Set the dark mode on the HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    onToggleTheme(newDarkMode);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Clear authentication token or session (assuming it's stored in localStorage)
    localStorage.removeItem('token'); // Replace 'token' with your actual key
    // Redirect to the homepage after logout
    router.push('/'); // This will redirect to the home page (app/page.tsx)
  };

  const handleOpenLogoutModal = () => {
    setOpenLogoutModal(true);  // Open the logout confirmation modal
  };

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false);  // Close the logout confirmation modal
  };

  const handleConfirmLogout = () => {
    handleLogout();
    handleCloseLogoutModal();  // Close the modal after confirming
  };

  const drawer = (
    <div>
      <List>
        <ListItem component="button" onClick={() => router.push('/admin/pets')}>
          <Pets />
          <ListItemText primary="Manage Pets" />
        </ListItem>
        <ListItem component="button" onClick={() => router.push('/admin/adoption-applications')}>
          <ManageSearch />
          <ListItemText primary="Adoption Applications" />
        </ListItem>
        <ListItem component="button" onClick={() => router.push('/admin/users')}>
          <Group />
          <ListItemText primary="Manage Users" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem component="button" onClick={handleToggleTheme}>
          {darkMode ? <DarkMode /> : <LightMode />}
          <ListItemText primary="Toggle Theme" />
        </ListItem>
        <ListItem component="button" onClick={handleOpenLogoutModal}>  {/* Open modal on logout click */}
          <ExitToApp />
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <AppBar position="sticky">
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2, display: { sm: 'none' } }}>
            <Menu />
          </IconButton>

          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            <Button color="inherit" startIcon={<Pets />} onClick={() => router.push('/admin/pets')}>Manage Pets</Button>
            <Button color="inherit" startIcon={<ManageSearch />} onClick={() => router.push('/admin/adoption-applications')}>Adoption Applications</Button>
            <Button color="inherit" startIcon={<Group />} onClick={() => router.push('/admin/users')}>Manage Users</Button>
          </Stack>

          {/* Dark mode toggle for desktop */}
          <IconButton color="inherit" onClick={handleToggleTheme} sx={{ display: { xs: 'none', sm: 'block' } }}>
            {darkMode ? <DarkMode /> : <LightMode />}
          </IconButton>

          {/* Logout button for desktop */}
          <IconButton color="inherit" onClick={handleOpenLogoutModal}>  {/* Open modal on logout click */}
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
        {drawer}
      </Drawer>

      {/* Logout Confirmation Modal */}
      <Dialog open={openLogoutModal} onClose={handleCloseLogoutModal}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default NavBar;
