'use client'

import { Box, Button, Grid, Typography, Card, CardContent } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: { xs: 2, sm: 4 }, textAlign: 'center' }}>
      {/* Logo and Welcome Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
        <Image src="/pet-logo.png" alt="Pet Adoption Logo" width={180} height={180} priority />
        <Typography variant="h3" sx={{ mt: 4 }}>Welcome to PetAdopt!</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Find your new furry friend today! Explore pets available for adoption and start the journey of making a difference.
        </Typography>
      </Box>

      {/* Featured Pets */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Featured Pets</Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Replace these with dynamic data */}
          {[{ name: 'Max - Golden Retriever', age: '2 years', image: '/square.png' }, { name: 'Bella - Labrador', age: '3 years', image: '/nano.png' }].map((pet, index) => (
            <Grid item key={index}>
              <Card sx={{ width: 240 }}>
                <Image src={pet.image} alt={`Pet ${index + 1}`} width={240} height={200} className="rounded-lg" />
                <CardContent>
                  <Typography variant="h6">{pet.name}</Typography>
                  <Typography variant="body2" color="textSecondary">Age: {pet.age}</Typography>
                  <Button variant="contained" sx={{ mt: 2 }} fullWidth>Adopt Now</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Adoption Process */}
      <Box sx={{ mb: 12 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>How it Works</Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: '1. Browse Pets', description: 'Explore our collection of pets available for adoption.' },
            { title: '2. Apply for Adoption', description: 'Fill out an adoption application and connect with the pet\'s caregiver.' },
            { title: '3. Bring Your New Friend Home!', description: 'Once approved, bring your new pet home and start a lifelong bond.' }
          ].map((step, index) => (
            <Grid item key={index} xs={12} sm={4}>
              <Card sx={{ padding: 2 }}>
                <Typography variant="h6">{step.title}</Typography>
                <Typography variant="body2" color="textSecondary">{step.description}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ mb: 16 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }} href="/login">Login</Button>
        <Button variant="outlined" color="primary" sx={{ borderColor: 'primary.main' }} href="/register">Register</Button>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
        <Link href="/about" passHref>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image src="/globe.svg" alt="Info icon" width={16} height={16} />
            About Us
          </Typography>
        </Link>
        <Link href="/contact" passHref>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image src="/window.svg" alt="Phone icon" width={16} height={16} />
            Contact Us
          </Typography>
        </Link>
        <Link href="/faq" passHref>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image src="/next.svg" alt="Help icon" width={16} height={16} />
            FAQ
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
