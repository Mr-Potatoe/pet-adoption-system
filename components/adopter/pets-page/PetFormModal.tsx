import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { useState } from 'react';

interface PetFormModalProps {
  open: boolean;
  pet: any | null;
  onClose: () => void;
  onSave: (pet: any) => void;
}

const PetFormModal = ({ open, pet, onClose, onSave }: PetFormModalProps) => {
  const [formData, setFormData] = useState(pet || { name: '', breed: '', age: '', age_unit: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{pet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Age Unit"
            name="age_unit"
            value={formData.age_unit}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PetFormModal;
