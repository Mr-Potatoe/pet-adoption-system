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
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        height: '100%', // Ensure consistent card heights
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'scale(1.03)' }, // Slight hover effect
      }}
    >
      <CardContent>
        <Box
          sx={{
            mb: 2,
            backgroundColor: 'grey.300',
            height: 180,
            borderRadius: 2,
            minHeight: 180,
          }}
        />
        <Typography variant="h6" gutterBottom noWrap>
          {pet.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" noWrap>
          Breed: {pet.breed || 'N/A'}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom noWrap>
          Age: {pet.age} {pet.age_unit}
        </Typography>
      </CardContent>
      <Box sx={{ padding: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onViewDetails(pet)}
          fullWidth
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

const PetList: React.FC<PetListProps> = ({ pets = [], onViewDetails }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 6;

  const filteredPets = Array.isArray(pets)
    ? pets.filter((pet) => pet.name.toLowerCase().includes(search.toLowerCase()))
    : [];

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
      {/* Search bar */}
      <TextField
        label="Search Pets"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{
          mb: 3,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <i className="fas fa-search" />
            </InputAdornment>
          ),
        }}
      />

      {/* Grid container */}
      <Grid container spacing={3}>
        {/* Render pet cards */}
        {currentPets.map((pet) => (
          <Grid item xs={12} sm={6} md={4} key={pet.id}>
            <PetCard pet={pet} onViewDetails={onViewDetails} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {filteredPets.length > petsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Pagination
            count={Math.ceil(filteredPets.length / petsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Message for empty results */}
      {filteredPets.length === 0 && (
        <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 5 }}>
          No pets found.
        </Typography>
      )}
    </Box>
  );
};

export default PetList;
