import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

interface AddPetModalProps {
  open: boolean;
  petData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ open, petData, onChange, onSubmit, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Post a New Pet</DialogTitle>
      <DialogContent>
        <TextField
          label="Pet Name"
          fullWidth
          name="name"
          value={petData.name}
          onChange={onChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Breed"
          fullWidth
          name="breed"
          value={petData.breed}
          onChange={onChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Age"
          fullWidth
          name="age"
          value={petData.age}
          onChange={onChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Age Unit"
          fullWidth
          name="age_unit"
          value={petData.age_unit}
          onChange={onChange}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={onSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPetModal;
