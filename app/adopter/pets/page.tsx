'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, CircularProgress, Alert, Grid, Card, CardContent, Button, Snackbar, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PetDetailsModal from '@/components/adopter/pets-page/PetDetailsModal';
import jwt from 'jsonwebtoken';

const AdopterPetsPage = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [tabValue, setTabValue] = useState(0); // Track selected tab for filter
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar for notifications
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  
    const fetchPets = async () => {
      setLoading(true); // Start loading state
  
      try {
        const decodedToken: any = jwt.decode(token);
        const userId = decodedToken?.userId;
  
        if (!userId) {
          setError('Unable to retrieve user ID from token');
          return;
        }
  
        const response = await fetch(`/api/adopter-pets?adopterId=${userId}`); // Fetch adopter-specific pets
  
        const data = await response.json();
        console.log('API Response:', data); // Log API response
  
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
  }, [router]); // Re-run when router changes

  const handleViewDetails = (pet: any) => {
    setSelectedPet(pet);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedPet(null);
  };

  const handleAdoptPet = async (petId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ petId, adopterId: userId }),
      });

      const data = await response.json();

      if (data.success) {
        setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== petId)); // Remove adopted pet from the list
        setError('');
        setOpenSnackbar(true); // Show success message
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error adopting pet');
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Separate pets into categories
  const separatedPets = {
    adopted: pets.filter(pet => pet.status === 'Adopted'),
    pending: pets.filter(pet => pet.status === 'Pending'),
    owners: pets.filter(pet => pet.ownerId === pet.adopterId), // Assuming pet.ownerId refers to the adopter
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align="center" color="primary.main" sx={{ py: 4 }}>
        Your Pets and Adoption Status
      </Typography>

      {/* Tab Navigation to filter by Adopted or Pending Pets */}
      <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="pet status filter">
          <Tab label="Adopted Pets" />
          <Tab label="Pending Pets" />
          <Tab label="Owner's Pets" />
        </Tabs>
      </Box>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      {/* Loading indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ py: 4 }}>
          {/* Conditional rendering for pet list */}
          {tabValue === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Breed</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {separatedPets.adopted.map((pet) => (
                    <TableRow key={pet.pet_id}>
                      <TableCell>{pet.name}</TableCell>
                      <TableCell>{pet.type}</TableCell>
                      <TableCell>{pet.breed}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewDetails(pet)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Breed</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {separatedPets.pending.map((pet) => (
                    <TableRow key={pet.pet_id}>
                      <TableCell>{pet.name}</TableCell>
                      <TableCell>{pet.type}</TableCell>
                      <TableCell>{pet.breed}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewDetails(pet)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 2 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Breed</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {separatedPets.owners.map((pet) => (
                    <TableRow key={pet.pet_id}>
                      <TableCell>{pet.name}</TableCell>
                      <TableCell>{pet.type}</TableCell>
                      <TableCell>{pet.breed}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewDetails(pet)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Pet Details Modal */}
      <PetDetailsModal
        open={openViewModal}
        pet={selectedPet}
        onClose={handleCloseViewModal}
        onAdopt={handleAdoptPet} // Pass the handleAdoptPet function to the modal
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Pet adopted successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default AdopterPetsPage;
