// components/adopter/pets-page/PetList.tsx

import React from 'react';
import { Button, Box, Typography } from '@mui/material';

// Define the props type for the PetList component
interface PetListProps {
  pets: any[]; // Ensure this matches your pet data structure
  onEdit: (pet?: any) => void;  // Add onEdit prop
  onDelete: (petId: string) => Promise<void>;  // Add onDelete prop
}

const PetList: React.FC<PetListProps> = ({ pets, onEdit, onDelete }) => {
  return (
    <Box>
      {pets.map((pet) => (
        <Box key={pet.pet_id} sx={{ mb: 2 }}>
          <Typography variant="h6">{pet.name}</Typography>
          <Typography variant="body2">{pet.breed}</Typography>
          <Typography variant="body2">{pet.age} {pet.age_unit}</Typography>
          <Button onClick={() => onEdit(pet)}>Edit</Button>
          <Button onClick={() => onDelete(pet.pet_id)}>Delete</Button>
        </Box>
      ))}
    </Box>
  );
};

export default PetList;
