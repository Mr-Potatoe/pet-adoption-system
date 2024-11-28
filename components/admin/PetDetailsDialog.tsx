import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Stack, Box } from '@mui/material';

const PetDetailsDialog = ({ pet, onClose }: { pet: any | null; onClose: () => void }) => (
  <Dialog open={!!pet} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{pet?.name}</DialogTitle>
    <DialogContent>
      {pet && (
        <Stack spacing={2}>
          {/* Display Pet Image */}
          {pet.image_url && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={pet.image_url}
                alt={pet.name}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
          
          {/* Pet Details */}
          <Typography variant="body1"><strong>Breed:</strong> {pet.breed}</Typography>
          <Typography variant="body1"><strong>Age:</strong> {pet.age} {pet.age_unit}</Typography>
          <Typography variant="body1"><strong>Description:</strong> {pet.description}</Typography>
          <Typography variant="body1"><strong>Medical History:</strong> {pet.medical_history}</Typography>
          <Typography variant="body1"><strong>Status:</strong> {pet.status}</Typography>
          <Typography variant="body1"><strong>Gender:</strong> {pet.gender}</Typography>
          <Typography variant="body1"><strong>Contact:</strong> {pet.contact}</Typography>
          <Typography variant="body1"><strong>Location:</strong> {pet.location}</Typography>
        </Stack>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default PetDetailsDialog;
