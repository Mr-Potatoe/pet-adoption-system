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
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const PetList = ({
  pets,
  onSelectPet,
  onEditPet,
  onDeletePet,
  onAddPet, // Pass the onAddPet function as a prop
}: {
  pets: any[];
  onSelectPet: (pet: any) => void;
  onEditPet: (pet: any) => void;
  onDeletePet: (petId: string) => void;
  onAddPet: (newPet: any) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [petToDelete, setPetToDelete] = useState<string | null>(null);
  const [openAddPetDialog, setOpenAddPetDialog] = useState(false); // State to open Add Pet dialog
  const [openEditDialog, setOpenEditDialog] = useState(false); // State to open Edit Pet dialog
  const [petBeingEdited, setPetBeingEdited] = useState<any | null>(null); // State for the pet being edited
  const itemsPerPage = 8; // Number of pets per page
  const [newPet, setNewPet] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    medical_history: '',
    status: 'Available', // Default status
    image_url: '',
    user_id: '',
    gender: '',
    contact: '',
    location: '',
    age_unit: 'years', // Default age unit
  });

  const [errors, setErrors] = useState<any>({}); // To store validation errors

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

  const handleDeleteConfirm = () => {
    if (petToDelete) {
      onDeletePet(petToDelete); // Delete the pet
      setPetToDelete(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleAddPetSubmit = () => {
    const newErrors: any = {};

    // Validate the new pet form
    if (!newPet.name) newErrors.name = 'Name is required';
    if (!newPet.breed) newErrors.breed = 'Breed is required';
    if (!newPet.age || isNaN(Number(newPet.age))) newErrors.age = 'Valid age is required';
    if (!newPet.description) newErrors.description = 'Description is required';
    if (!newPet.contact) newErrors.contact = 'Contact is required';
    if (!newPet.location) newErrors.location = 'Location is required';
    if (!newPet.gender) newErrors.gender = 'Gender is required';
    if (!newPet.image_url) newErrors.image_url = 'Image URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors
    } else {
      onAddPet(newPet); // Call the onAddPet function passed as prop
      setOpenAddPetDialog(false); // Close the Add Pet dialog
    }
  };

  const handleEditButtonClick = (pet: any) => {
    setPetBeingEdited(pet);
    setOpenEditDialog(true);
  };

  const handleEditPetSubmit = () => {
    const newErrors: any = {};

    // Validate the edited pet form
    if (!petBeingEdited?.name) newErrors.name = 'Name is required';
    if (!petBeingEdited?.breed) newErrors.breed = 'Breed is required';
    if (!petBeingEdited?.age || isNaN(Number(petBeingEdited?.age))) newErrors.age = 'Valid age is required';
    if (!petBeingEdited?.description) newErrors.description = 'Description is required';
    if (!petBeingEdited?.contact) newErrors.contact = 'Contact is required';
    if (!petBeingEdited?.location) newErrors.location = 'Location is required';
    if (!petBeingEdited?.gender) newErrors.gender = 'Gender is required';
    if (!petBeingEdited?.image_url) newErrors.image_url = 'Image URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors
    } else {
      onEditPet(petBeingEdited); // Pass the edited pet to parent
      setOpenEditDialog(false); // Close the Edit Pet dialog
    }
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

      {/* Add Pet Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddPetDialog(true)}
        sx={{ mb: 3 }}
      >
        Add New Pet
      </Button>

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
                    image={pet.image_url || '/pet.png'}
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
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleEditButtonClick(pet)}
                      sx={{ mt: 2 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      color="error"
                      onClick={() => {
                        setPetToDelete(pet.pet_id);
                        setOpenDeleteDialog(true);
                      }}
                      sx={{ mt: 2 }}
                    >
                      Delete
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this pet?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Pet Dialog */}
      <Dialog open={openAddPetDialog} onClose={() => setOpenAddPetDialog(false)}>
        <DialogTitle>Add New Pet</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={newPet.name}
            onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Breed"
            fullWidth
            value={newPet.breed}
            onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
            error={!!errors.breed}
            helperText={errors.breed}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Age"
            fullWidth
            value={newPet.age}
            onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
            error={!!errors.age}
            helperText={errors.age}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={newPet.description}
            onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Medical History"
            fullWidth
            value={newPet.medical_history}
            onChange={(e) => setNewPet({ ...newPet, medical_history: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contact"
            fullWidth
            value={newPet.contact}
            onChange={(e) => setNewPet({ ...newPet, contact: e.target.value })}
            error={!!errors.contact}
            helperText={errors.contact}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            fullWidth
            value={newPet.location}
            onChange={(e) => setNewPet({ ...newPet, location: e.target.value })}
            error={!!errors.location}
            helperText={errors.location}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL"
            fullWidth
            value={newPet.image_url}
            onChange={(e) => setNewPet({ ...newPet, image_url: e.target.value })}
            error={!!errors.image_url}
            helperText={errors.image_url}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPetDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddPetSubmit} color="primary">
            Add Pet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Pet Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Pet</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={petBeingEdited?.name || ''}
            onChange={(e) =>
              setPetBeingEdited({ ...petBeingEdited, name: e.target.value })
            }
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Breed"
            fullWidth
            value={petBeingEdited?.breed || ''}
            onChange={(e) =>
              setPetBeingEdited({ ...petBeingEdited, breed: e.target.value })
            }
            error={!!errors.breed}
            helperText={errors.breed}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Age"
            fullWidth
            value={petBeingEdited?.age || ''}
            onChange={(e) =>
              setPetBeingEdited({ ...petBeingEdited, age: e.target.value })
            }
            error={!!errors.age}
            helperText={errors.age}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={petBeingEdited?.description || ''}
            onChange={(e) =>
              setPetBeingEdited({ ...petBeingEdited, description: e.target.value })
            }
            error={!!errors.description}
            helperText={errors.description}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Medical History"
            fullWidth
            value={petBeingEdited?.medical_history || ''}
            onChange={(e) =>
              setPetBeingEdited({ ...petBeingEdited, medical_history: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contact"
            fullWidth
            value={petBeingEdited?.contact || ''}
            onChange={(e) =>
              setPetBeingEdited({ ...petBeingEdited, contact: e.target.value })
            }
            error={!!errors.contact}
            helperText={errors.contact}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            fullWidth
            value={petBeingEdited?.location || ''}
            onChange={(e) =>
              setPetBeingEdited({ ...petBeingEdited, location: e.target.value })
            }
            error={!!errors.location}
            helperText={errors.location}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL"
            fullWidth
            value={petBeingEdited?.image_url || ''}
            onChange={(e) =>
              setPetBeingEdited({ ...petBeingEdited, image_url: e.target.value })
            }
            error={!!errors.image_url}
            helperText={errors.image_url}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditPetSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PetList;
