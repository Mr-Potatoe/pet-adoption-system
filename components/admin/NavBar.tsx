'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';  // usePathname hook
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  Menu,
  Pets,
  Group,
  ManageSearch,
  ExitToApp,
  Dashboard,
} from '@mui/icons-material';
import { ButtonBase } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const NavBar = ({ onToggleTheme }: { onToggleTheme: (darkMode: boolean) => void }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [activePath, setActivePath] = useState('');
  const pathname = usePathname(); // Using usePathname to get the current path

  // Sync theme with localStorage and system preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches));
  }, []);

  // Update HTML class and localStorage on theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Track the current active route
  useEffect(() => {
    setActivePath(pathname || '');
  }, [pathname]);

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    onToggleTheme(!darkMode);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';  // Force navigation after logout
  };

  const drawer = (
    <div>
      <List>
        <ListItem
          component={ButtonBase}
          onClick={() => window.location.href = '/admin'}
          sx={{
            backgroundColor: activePath === '/admin' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          }}
        >
          <Dashboard />
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          component={ButtonBase}
          onClick={() => window.location.href = '/admin/pets'}
          sx={{
            backgroundColor: activePath === '/admin/pets' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          }}
        >
          <Pets />
          <ListItemText primary="Manage Pets" />
        </ListItem>
        <ListItem
          component={ButtonBase}
          onClick={() => window.location.href = '/admin/adoption-applications'}
          sx={{
            backgroundColor: activePath === '/admin/adoption-applications' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          }}
        >
          <ManageSearch />
          <ListItemText primary="Adoption Applications" />
        </ListItem>
        <ListItem
          component={ButtonBase}
          onClick={() => window.location.href = '/admin/users'}
          sx={{
            backgroundColor: activePath === '/admin/users' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          }}
        >
          <Group />
          <ListItemText primary="Manage Users" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem component={ButtonBase} onClick={handleToggleTheme}>
          {darkMode ? <DarkMode /> : <LightMode />}
          <ListItemText primary="Toggle Theme" />
        </ListItem>
        <ListItem component={ButtonBase} onClick={() => setOpenLogoutModal(true)}>
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
          {/* Navbar Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pet Adoption System
          </Typography>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <Menu />
          </IconButton>

          {/* Desktop Navigation */}
          <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Button
              color="inherit"
              startIcon={<Dashboard />}
              onClick={() => window.location.href = '/admin'}
              sx={{
                backgroundColor: activePath === '/admin' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<Pets />}
              onClick={() => window.location.href = '/admin/pets'}
              sx={{
                backgroundColor: activePath === '/admin/pets' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              }}
            >
              Manage Pets
            </Button>
            <Button
              color="inherit"
              startIcon={<ManageSearch />}
              onClick={() => window.location.href = '/admin/adoption-applications'}
              sx={{
                backgroundColor: activePath === '/admin/adoption-applications' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              }}
            >
              Adoption Applications
            </Button>
            <Button
              color="inherit"
              startIcon={<Group />}
              onClick={() => window.location.href = '/admin/users'}
              sx={{
                backgroundColor: activePath === '/admin/users' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              }}
            >
              Manage Users
            </Button>
          </Stack>

          {/* Theme Toggle */}
          <IconButton color="inherit" onClick={handleToggleTheme} sx={{ ml: 1 }}>
            {darkMode ? <DarkMode /> : <LightMode />}
          </IconButton>

          {/* Logout Button */}
          <IconButton color="inherit" onClick={() => setOpenLogoutModal(true)} sx={{ ml: 1 }}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
        {drawer}
      </Drawer>

      {/* Logout Confirmation Modal */}
      <Dialog open={openLogoutModal} onClose={() => setOpenLogoutModal(false)}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default NavBar;
