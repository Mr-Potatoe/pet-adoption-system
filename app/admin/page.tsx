'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Alert,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import NavBar from '@/components/admin/NavBar';
import PetList from '@/components/admin/PetList';
import AddPetModal from '@/components/admin/AddPetModal';
import PetDetailsDialog from '@/components/admin/PetDetailsDialog';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from '@/components/Footer';  // Import the Footer component
import jwt from 'jsonwebtoken';

const Admin = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [petAdded, setPetAdded] = useState(false); // New state to track if a pet was added

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Decode token and get user ID
    try {
      const decodedToken: any = jwt.decode(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        setError('User is not authenticated.');
        router.push('/login');
        return;
      }
    } catch (error) {
      setError('Invalid token. Please log in again.');
      router.push('/login');
      return;
    }

    if (petAdded) {
      setPetAdded(false); // Reset after fetch
      return; // Skip fetch if a pet was just added
    }

    (async () => {
      try {
        const response = await fetch('/api/pets');
        const data = await response.json();
        if (data.success) setPets(data.pets);
        else setError(data.message || 'Failed to load pets.');
      } catch (error) {
        setError('Error fetching pets.');
      } finally {
        setLoading(false);
      }
    })();
  }, [router, petAdded]); // Only re-run if router or petAdded changes

  const handleAddPet = (newPet: any) => {
    setPets((prevPets) => [...prevPets, newPet]); // Optimistic update
  };

  // Define themes
  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <NavBar onToggleTheme={setDarkMode} />
      <Container sx={{ position: 'relative' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            py: 2,
            fontSize: {
              xs: '2rem', // Extra small screens
              sm: '2.5rem', // Small screens (mobile)
              md: '3rem', // Medium screens (tablet)
              lg: '3.5rem', // Large screens (desktop)
            },
          }}
        >
          Admin Dashboard
        </Typography>


        {error && <Alert severity="error">{error}</Alert>}

        <Typography variant="h5" gutterBottom>
          Pets List
        </Typography>

        {/* Add New Pet button at the top-right */}
        <Box position="absolute" top={20} right={20}>
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            sx={{
              boxShadow: 3,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Add New Pet
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <PetList pets={pets} onSelectPet={setSelectedPet} />
        )}

        <AddPetModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onAddPet={handleAddPet}
          setPetAdded={setPetAdded} // Pass the state setter to the modal
        />
        <PetDetailsDialog pet={selectedPet} onClose={() => setSelectedPet(null)} />
      </Container>
      <Footer />
    </ThemeProvider>
  );
};

export default Admin;
