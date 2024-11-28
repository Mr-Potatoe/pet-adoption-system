'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import PetList from '@/components/adopter/PetList';
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
      try {
        const response = await fetch('/api/pets?status=available'); // Fetch only available pets
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
      <Typography variant="h3" gutterBottom align="center" color="primary.main" sx={{ py: 4 }}>
        Available Pets for Adoption
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <PetList pets={pets} onViewDetails={handleViewDetails} />
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
