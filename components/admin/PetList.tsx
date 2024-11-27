import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Select,
  MenuItem,
  Stack,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
} from '@mui/material';

const PetList = ({
  pets,
  onSelectPet,
}: {
  pets: any[];
  onSelectPet: (pet: any) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of pets per page

  // Extract unique breeds for the filter dropdown
  const breeds = Array.from(new Set(pets.map((pet) => pet.breed))).sort();

  // Filter pets based on search term and selected breed
  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedBreed === '' || pet.breed === selectedBreed)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  const displayedPets = filteredPets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Stack spacing={2} mb={2}>
        {/* Search Input */}
        <TextField
          label="Search Pets"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Breed Filter Dropdown */}
        <Select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">
            <em>All Breeds</em>
          </MenuItem>
          {breeds.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {breed}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {/* Pet Cards */}
      {filteredPets.length === 0 ? (
        <Typography>No pets match the criteria.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {displayedPets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pet.pet_id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={pet.image_url || '/default-pet-image.jpg'}
                    alt={pet.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{pet.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Breed: {pet.breed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age: {pet.age} {pet.age_unit}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => onSelectPet(pet)}
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PetList;
