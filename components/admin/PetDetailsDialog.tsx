import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Stack } from '@mui/material';

const PetDetailsDialog = ({ pet, onClose }: { pet: any | null; onClose: () => void }) => (
  <Dialog open={!!pet} onClose={onClose}>
    <DialogTitle>{pet?.name}</DialogTitle>
    <DialogContent>
      {pet && (
        <Stack spacing={2}>
          <Typography>Breed: {pet.breed}</Typography>
          <Typography>
            Age: {pet.age} {pet.age_unit}
          </Typography>
          <Typography>Description: {pet.description}</Typography>
        </Stack>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default PetDetailsDialog;
