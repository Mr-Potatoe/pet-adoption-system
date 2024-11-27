import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';

const AddPetModal = ({ open, onClose, onAddPet, setPetAdded }: { open: boolean; onClose: () => void; onAddPet: (pet: any) => void; setPetAdded: (value: boolean) => void }) => {
  const [newPet, setNewPet] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    medical_history: '',
    status: 'Available',
    image_url: '',
    user_id: '',
    gender: '',
    contact: '',
    location: '',
    age_unit: 'years',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) throw new Error('User ID is missing. Please log in again.');

      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newPet, user_id: parseInt(userId, 10) }),
      });

      const data = await response.json();
      if (data.success) {
        onAddPet(data.pet);
        setPetAdded(true); // Notify parent that a new pet was added
        onClose();
      } else throw new Error(data.message || 'Failed to add pet.');
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Pet</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Name" name="name" fullWidth value={newPet.name} onChange={handleChange} />
          <TextField label="Breed" name="breed" fullWidth value={newPet.breed} onChange={handleChange} />
          <TextField label="Age" name="age" type="number" fullWidth value={newPet.age} onChange={handleChange} />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            fullWidth
            value={newPet.description}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Pet</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPetModal;
