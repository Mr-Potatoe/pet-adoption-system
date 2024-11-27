import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, TextField, Grid, Pagination, InputAdornment } from '@mui/material';

interface PetCardProps {
  pet: any;
  onViewDetails: (pet: any) => void;
}

interface PetListProps {
  pets: any[];
  onViewDetails: (pet: any) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onViewDetails }) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, height: '100%' }}>
      <CardContent>
        <Box sx={{ mb: 2, backgroundColor: 'grey.300', height: 200, borderRadius: 2, minHeight: 200 }} />
        <Typography variant="h6" gutterBottom noWrap>{pet.name}</Typography>
        <Typography variant="body1" color="textSecondary" noWrap>Breed: {pet.breed || 'N/A'}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom noWrap>Age: {pet.age} {pet.age_unit}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onViewDetails(pet)}
          fullWidth
          sx={{ mt: 2 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

const PetList: React.FC<PetListProps> = ({ pets = [], onViewDetails }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 6;

  const filteredPets = Array.isArray(pets) ? pets.filter(pet => pet.name.toLowerCase().includes(search.toLowerCase())) : [];

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Search Pets"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <i className="fas fa-search" />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {currentPets.map((pet) => (
          <Grid item xs={12} sm={6} md={4} key={pet.id}>
            <PetCard pet={pet} onViewDetails={onViewDetails} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Pagination
          count={Math.ceil(filteredPets.length / petsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default PetList;
