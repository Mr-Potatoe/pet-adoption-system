import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Stack, Box, Card, CardMedia, Divider, Chip } from '@mui/material';
import { Info, ContactPhone, LocationOn, MedicalServices, Male, Female, Pets } from '@mui/icons-material';

const PetDetailsDialog = ({ pet, onClose }: { pet: any | null; onClose: () => void }) => (
  <Dialog open={!!pet} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, fontSize: '1.5rem', color: '#1976d2' }}>
      {pet?.name}
    </DialogTitle>
    <DialogContent sx={{ padding: 3 }}>
      {pet && (
        <Stack spacing={3}>
          {/* Display Pet Image */}
          {pet.image_url && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ maxWidth: 350, borderRadius: 2, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  image={pet.image_url}
                  alt={pet.name}
                  sx={{
                    height: 300,
                    objectFit: 'cover',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
              </Card>
            </Box>
          )}
          

          {/* Pet Details */}
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>Details</Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Stack direction="row" spacing={1} alignItems="center">
              <Info color="primary" />
              <Typography variant="body1"><strong>Breed:</strong> {pet.breed}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Pets color="primary" />
              <Typography variant="body1"><strong>Age:</strong> {pet.age} {pet.age_unit}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body1"><strong>Description:</strong> {pet.description}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <MedicalServices color="primary" />
              <Typography variant="body1"><strong>Medical History:</strong> {pet.medical_history}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={pet.status} color={pet.status === 'Available' ? 'success' : 'warning'} sx={{ fontWeight: 600 }} />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {pet.gender === 'Male' ? <Male color="primary" /> : <Female color="primary" />}
              <Typography variant="body1"><strong>Gender:</strong> {pet.gender}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <ContactPhone color="primary" />
              <Typography variant="body1"><strong>Contact:</strong> {pet.contact}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOn color="primary" />
              <Typography variant="body1"><strong>Location:</strong> {pet.location}</Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </DialogContent>

    <DialogActions sx={{ justifyContent: 'center' }}>
      <Button onClick={onClose} sx={{ fontWeight: 600, color: '#1976d2' }}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default PetDetailsDialog;
