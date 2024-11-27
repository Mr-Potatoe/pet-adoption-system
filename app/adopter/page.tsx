'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Grid, Box, CircularProgress, Alert, Button } from '@mui/material';
import NavBar from '@/components/adopter/AdopterNav';
import PetList from '@/components/adopter/PetList';
import PetDetailsModal from '@/components/adopter/PetDetailsModal';
import AddPetModal from '@/components/adopter/AddPetModal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from '@/components/Footer';  // Import the Footer component
import jwt from 'jsonwebtoken';

const Adopter = () => {
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
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', breed: '', age: '', age_unit: '' });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }

    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');
        const data = await response.json();
        if (data.success) {
          setPets(data.pets);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Error fetching pets');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  const handleViewDetails = (pet: any) => {
    setSelectedPet(pet);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedPet(null);
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleChangeNewPet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  const handleAddNewPet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      // Decode the token to extract the user_id (JWT token expected)
      const decodedToken: any = jwt.decode(token);
      const userId = decodedToken?.userId;  // Ensure to replace with the actual decoded key if different

      if (!userId) {
        setError('Unable to retrieve user ID from token');
        return;
      }

      // Add missing fields: status and user_id
      const petWithDetails = { ...newPet, status: 'available', user_id: userId };

      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petWithDetails),
      });

      const data = await response.json();
      if (data.success) {
        setPets((prevPets) => [...prevPets, data.pet]);
        handleCloseAddModal();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error adding pet');
    }
  };

  return (
    <>
      <NavBar onToggleTheme={setDarkMode} />
      <ThemeProvider theme={darkMode ? createTheme({ palette: { mode: 'dark' } }) : createTheme({ palette: { mode: 'light' } })}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

          <Typography variant="h3" gutterBottom align="center" color="primary.main" sx={{ py: 4 }}>
            Available Pets
          </Typography>

          {/* Button to Add Pet */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button variant="contained" color="primary" onClick={handleOpenAddModal}>Post a New Pet</Button>
          </Box>

          {/* Loading State */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Pass the entire pets array to PetList */}
              <PetList pets={pets} onViewDetails={handleViewDetails} />
            </>
          )}

          {/* Modals */}
          <PetDetailsModal open={openViewModal} pet={selectedPet} onClose={handleCloseViewModal} />
          <AddPetModal open={openAddModal} petData={newPet} onChange={handleChangeNewPet} onSubmit={handleAddNewPet} onClose={handleCloseAddModal} />
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Adopter;
