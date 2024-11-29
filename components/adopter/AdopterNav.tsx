'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Button, IconButton, Stack, Drawer, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { LightMode, DarkMode, Menu, Pets, ManageSearch, ExitToApp, Person } from '@mui/icons-material';
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
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [activePage, setActivePage] = useState<string>(''); // Track active page
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

  const handleNavigation = (path: string) => {
    setActivePage(path); // Set the active page when a button is clicked
    router.push(path); // Navigate to the selected page
  };

  const drawer = (
    <div>
      <List>
        <ListItem
          component="button"
          onClick={() => handleNavigation('/adopter')}
          sx={{
            backgroundColor: activePage === '/adopter' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
            color: darkMode ? 'primary' : 'inherit', // Text color based on darkMode
            '&:hover': {
              backgroundColor: activePage === '/adopter' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? 'primary' : 'inherit',
            },
            transition: 'background-color 0.3s, color 0.3s',
          }}
        >
          <Pets />
          <ListItemText primary="Available Pets" />
        </ListItem>
        <ListItem
          component="button"
          onClick={() => handleNavigation('/adopter/pets')}
          sx={{
            backgroundColor: activePage === '/adopter/pets' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
            color: darkMode ? 'primary' : 'inherit',
            '&:hover': {
              backgroundColor: activePage === '/adopter/pets' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? 'primary' : 'inherit',
            },
            transition: 'background-color 0.3s, color 0.3s',
          }}
        >
          <Pets />
          <ListItemText primary="Your Pets" />
        </ListItem>
        <ListItem
          component="button"
          onClick={() => handleNavigation('/adopter/profile')}
          sx={{
            backgroundColor: activePage === '/adopter/profile' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
            color: darkMode ? 'primary' : 'inherit',
            '&:hover': {
              backgroundColor: activePage === '/adopter/profile' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? 'primary' : 'inherit',
            },
            transition: 'background-color 0.3s, color 0.3s',
          }}
        >
          <Person />
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem
          component="button"
          onClick={handleToggleTheme}
          sx={{
            color: darkMode ? 'primary' : 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? 'primary' : 'inherit',
            },
            transition: 'background-color 0.3s, color 0.3s',
          }}
        >
          {darkMode ? <DarkMode /> : <LightMode />}
          <ListItemText primary="Toggle Theme" />
        </ListItem>
        <ListItem
          component="button"
          onClick={handleOpenLogoutModal}
          sx={{
            color: darkMode ? 'primary' : 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? 'primary' : 'inherit',
            },
            transition: 'background-color 0.3s, color 0.3s',
          }}
        >
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
          {/* System Title aligned to the left */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pet Adoption System
          </Typography>

          {/* Mobile Dark Mode and Logout Icons */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'flex', sm: 'none' }, ml: 'auto' }}>
            <IconButton color="inherit" onClick={handleToggleTheme}>
              {darkMode ? <DarkMode /> : <LightMode />}
            </IconButton>
            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ display: { sm: 'none' } }}
            >
              <Menu />
            </IconButton>
            <IconButton color="inherit" onClick={handleOpenLogoutModal}>
              <ExitToApp />
            </IconButton>
          </Stack>

          {/* Stack for Navigation (for larger screens) */}
          <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' }, mx: 'auto' }}>
            <Button
              sx={{
                backgroundColor: activePage === '/adopter' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                color: darkMode ? 'primary' : 'inherit',  // Text color based on darkMode
                '&:hover': {
                  backgroundColor: activePage === '/adopter' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: darkMode ? 'primary' : 'inherit',  // Maintain text color on hover
                },
                transition: 'background-color 0.3s, color 0.3s',  // Transition for background color and text color
              }}
              startIcon={<Pets />}
              onClick={() => handleNavigation('/adopter')}
            >
              Available Pets
            </Button>
            <Button
              sx={{
                backgroundColor: activePage === '/adopter/pets' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                color: darkMode ? 'primary' : 'inherit',
                '&:hover': {
                  backgroundColor: activePage === '/adopter/pets' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: darkMode ? 'primary' : 'inherit',
                },
                transition: 'background-color 0.3s, color 0.3s',
              }}
              startIcon={<Pets />}
              onClick={() => handleNavigation('/adopter/pets')}
            >
              Your Pets
            </Button>
            <Button
              sx={{
                backgroundColor: activePage === '/adopter/profile' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                color: darkMode ? 'primary' : 'inherit',
                '&:hover': {
                  backgroundColor: activePage === '/adopter/profile' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: darkMode ? 'primary' : 'inherit',
                },
                transition: 'background-color 0.3s, color 0.3s',
              }}
              startIcon={<Person />}
              onClick={() => handleNavigation('/adopter/profile')}
            >
              Profile
            </Button>
          </Stack>


          {/* Dark mode toggle and logout (aligned to the right for desktop) */}
          <Stack direction="row" spacing={2} sx={{ ml: 'auto', display: { xs: 'none', sm: 'flex' } }}>
            <IconButton color="inherit" onClick={handleToggleTheme}>
              {darkMode ? <DarkMode /> : <LightMode />}
            </IconButton>
            <IconButton color="inherit" onClick={handleOpenLogoutModal}>
              <ExitToApp />
            </IconButton>
          </Stack>
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
