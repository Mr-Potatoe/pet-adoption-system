'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    onToggleTheme(!darkMode);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const drawer = (
    <div>
      <List>
        <ListItem component={ButtonBase} onClick={() => router.push('/admin/pets')}>
          <Pets />
          <ListItemText primary="Manage Pets" />
        </ListItem>
        <ListItem component={ButtonBase} onClick={() => router.push('/admin/adoption-applications')}>
          <ManageSearch />
          <ListItemText primary="Adoption Applications" />
        </ListItem>
        <ListItem component={ButtonBase} onClick={() => router.push('/admin/users')}>
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
            <Button color="inherit" startIcon={<Pets />} onClick={() => router.push('/admin/pets')}>
              Manage Pets
            </Button>
            <Button color="inherit" startIcon={<ManageSearch />} onClick={() => router.push('/admin/adoption-applications')}>
              Adoption Applications
            </Button>
            <Button color="inherit" startIcon={<Group />} onClick={() => router.push('/admin/users')}>
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
