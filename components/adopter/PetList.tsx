import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

interface PetListProps {
  pets: any[];
  onViewDetails: (pet: any) => void;
}

const PetList = ({ pets, onViewDetails }: PetListProps) => (
  <Grid container spacing={2}>
    {pets.map((pet) => (
      <Grid item xs={12} sm={6} md={4} key={pet.pet_id}>
        <Card>
          <CardContent>
            <Typography variant="h6">{pet.name}</Typography>
            <Typography>Breed: {pet.breed}</Typography>
            <Typography>Age: {pet.age} {pet.age_unit}</Typography>
          </CardContent>
          <Button onClick={() => onViewDetails(pet)}>View Details</Button>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default PetList;
