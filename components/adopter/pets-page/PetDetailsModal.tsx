import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface PetDetailsModalProps {
  open: boolean;
  pet: any | null;
  onClose: () => void;
  onAdopt: (petId: string) => void;
}

const PetDetailsModal = ({ open, pet, onClose, onAdopt }: PetDetailsModalProps) => {
  if (!pet) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pet Details</DialogTitle>
      <DialogContent>
        <Typography>Name: {pet.name}</Typography>
        <Typography>Breed: {pet.breed}</Typography>
        <Typography>Age: {pet.age} {pet.age_unit}</Typography>
        <Typography>Status: {pet.status}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Close</Button>
        <Button onClick={() => onAdopt(pet.pet_id)} color="primary" variant="contained">Adopt</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PetDetailsModal;
