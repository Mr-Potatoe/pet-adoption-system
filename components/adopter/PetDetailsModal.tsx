import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

interface PetDetailsModalProps {
  open: boolean;
  pet: any | null;
  onClose: () => void;
}

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ open, pet, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pet Details</DialogTitle>
      <DialogContent>
        {pet && (
          <>
            <Typography variant="h6" color="primary">{pet.name}</Typography>
            <Typography variant="body1">Breed: {pet.breed}</Typography>
            <Typography variant="body2">Age: {pet.age} {pet.age_unit}</Typography>
            <Typography variant="body2">Description: {pet.description}</Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PetDetailsModal;
