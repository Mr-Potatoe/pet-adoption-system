'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, CircularProgress, Alert, Button, Grid, Paper } from '@mui/material';
import PetDetailsModal from '@/components/adopter/pets-page/PetDetailsModal';
import jwt from 'jsonwebtoken';

const AdopterPage = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchPets = async () => {
      setLoading(true); // Start loading state

      try {
        const status = 'Available'; // You can modify this value dynamically based on user selection (e.g., Available, Pending)
        const response = await fetch(`/api/pets?status=${status}`); // Fetch pets with the selected status

        const data = await response.json();

        if (data.success) {
          setPets(data.pets); // Set the fetched pets in the state
        } else {
          setError(data.message); // Set error message if fetching failed
        }
      } catch (err) {
        setError('Error fetching pets'); // Set a generic error message in case of network or server error
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchPets();
  }, [router]);

  const handleViewDetails = (pet: any) => {
    setSelectedPet(pet);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedPet(null);
  };

  const handleAdoptPet = async (petId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      const decodedToken: any = jwt.decode(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        setError('Unable to retrieve user ID from token');
        return;
      }

      const response = await fetch(`/api/adopt-pet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        body: JSON.stringify({ petId, adopterId: userId }),
      });

      const data = await response.json();
      if (data.success) {
        setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== petId)); // Remove adopted pet from the list
        setError('');
        handleCloseViewModal();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error adopting pet');
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align="center" color="primary.main" sx={{ py: 4 }}>
        Available Pets for Adoption
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
          <Button color="inherit" size="small" sx={{ marginLeft: 1 }} onClick={() => setError('')}>
            Dismiss
          </Button>
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {pets.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" sx={{ py: 4 }}>
                No pets available for adoption at the moment. Check back later!
              </Typography>
            </Grid>
          ) : (
            pets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} key={pet.pet_id}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>{pet.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{pet.breed}</Typography>
                  <Typography variant="body2" color="textSecondary">Age: {pet.age} {pet.age_unit}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    onClick={() => handleViewDetails(pet)}
                  >
                    View Details
                  </Button>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <PetDetailsModal
        open={openViewModal}
        pet={selectedPet}
        onClose={handleCloseViewModal}
        onAdopt={handleAdoptPet}
      />
    </>
  );
};

export default AdopterPage;
