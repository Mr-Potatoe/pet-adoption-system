'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import PetList from '@/components/adopter/pets-page/PetList';
import PetFormModal from '@/components/adopter/pets-page/PetFormModal';
import jwt from 'jsonwebtoken';

const MyPetsPage = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchMyPets = async () => {
      try {
        const response = await fetch('/api/users-pets', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add Authorization header with Bearer token
          },
        });
        const data = await response.json();
        if (data.success) {
          setPets(data.pets);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Error fetching your pets');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPets();
  }, [router]);

  const handleOpenFormModal = (pet: any = null) => {
    setSelectedPet(pet);
    setIsEditing(!!pet);
    setOpenFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenFormModal(false);
    setSelectedPet(null);
  };

  const handleSavePet = async (pet: any) => {
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

      // Add status and user_id if not editing an existing pet
      const petData = {
        ...pet,
        status: pet.status || 'available', // default status if not provided
        user_id: userId,
      };

      const endpoint = isEditing ? `/api/pets/${pet.pet_id}` : '/api/pets';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData),
      });

      const data = await response.json();
      if (data.success) {
        if (isEditing) {
          setPets((prevPets) =>
            prevPets.map((p) => (p.pet_id === pet.pet_id ? data.pet : p))
          );
        } else {
          setPets((prevPets) => [...prevPets, data.pet]);
        }
        handleCloseFormModal();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error saving pet');
    }
  };


  const handleDeletePet = async (petId: string) => {
    try {
      const response = await fetch(`/api/pets/${petId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== petId));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error deleting pet');
    }
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center" color="primary.main" sx={{ py: 4 }}>
        My Pets
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => handleOpenFormModal()}>
          Add New Pet
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <PetList pets={pets} onEdit={handleOpenFormModal} onDelete={handleDeletePet} />
      )}

      <PetFormModal
        open={openFormModal}
        pet={selectedPet}
        onClose={handleCloseFormModal}
        onSave={handleSavePet}
      />
    </>
  );
};

export default MyPetsPage;
