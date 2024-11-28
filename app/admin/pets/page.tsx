'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import PetList from '@/components/admin/PetList';
import PetDetailsDialog from '@/components/admin/PetDetailsDialog';
import jwt from 'jsonwebtoken';

const AdminPetsPage = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [petAdded, setPetAdded] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>(''); // New state for snackbar message
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
      setPetAdded(false); // Reset after fetching
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
  }, [router, petAdded]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const decoded: any = jwt.decode(token);
      return decoded?.userId || '';
    } catch (error) {
      console.error('Error decoding token', error);
      return '';
    }
  };

  const handleAddPet = async (newPet: any) => {
    const userId = getUserIdFromToken(); // Get user ID from token
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    // Add user_id to the newPet object
    const petWithUserId = { ...newPet, user_id: userId };

    // Optimistic Update: Immediately add the new pet to the UI
    setPets((prevPets) => [...prevPets, petWithUserId]);

    // Show success snackbar
    setSnackbarMessage("Pet added successfully!");
    setOpenSnackbar(true);

    try {
      // Make the API call to add the new pet to the backend
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petWithUserId), // Send the pet with user_id
      });

      const data = await response.json();

      if (data.success) {
        console.log('Pet added successfully');
      } else {
        throw new Error('Failed to add pet');
      }
    } catch (error) {
      console.error('Error adding pet:', error);

      // Revert the optimistic update if the API call fails
      setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== petWithUserId.pet_id));

      // Optionally, show an error message
      setSnackbarMessage("Error adding pet. Please try again.");
      setOpenSnackbar(true);
    }
  };
  
  const handleEditPet = async (editedPet: any) => {
    // Optimistic Update
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.pet_id === editedPet.pet_id ? { ...pet, ...editedPet } : pet
      )
    );

    try {
      // Make the API call to update the pet data
      const response = await fetch(`/api/pets/${editedPet.pet_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPet),
      });

      const data = await response.json();

      // If the API call is successful, return without doing anything further
      if (data.success) {
        console.log('Pet updated successfully');
      } else {
        throw new Error('Failed to update pet');
      }
    } catch (error) {
      console.error('Error updating pet:', error);

      // Rollback to the previous state if the update fails
      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet.pet_id === editedPet.pet_id ? { ...pet, ...editedPet } : pet
        )
      );
    }
  };


  const handleDeletePet = async (petId: string) => {
    try {
      // Send a DELETE request to the API to delete the pet
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Optimistically update the state if the deletion was successful
        setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== petId));
        setSnackbarMessage("Pet deleted successfully!"); // Set the correct message for deletion
        setOpenSnackbar(true); // Show success snackbar
      } else {
        setError('Failed to delete the pet.');
      }
    } catch (error) {
      setError('Error deleting pet.');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container sx={{ position: 'relative' }}>
      <Typography variant="h3" gutterBottom sx={{ py: 2 }}>
        Pets List
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <PetList
          pets={pets}
          onSelectPet={setSelectedPet}
          onEditPet={handleEditPet}
          onDeletePet={handleDeletePet}
          onAddPet={handleAddPet} // Pass the add pet handler to PetList
        />
      )}

      <PetDetailsDialog pet={selectedPet} onClose={() => setSelectedPet(null)} />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage} // Dynamically set the snackbar message
      />
    </Container>
  );
};

export default AdminPetsPage;
