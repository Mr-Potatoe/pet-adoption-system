'use client';

import { Box, Button, Grid, Typography, Card, CardContent } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Define the Pet interface
interface Pet {
  pet_id: number;
  name: string;
  image_url: string | null;
  age: number;
  age_unit: string; // e.g., "years" or "months"
}

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]); // Specify the type of pets state
  const [loading, setLoading] = useState(true);

  // Fetch pets from /api/pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');
        const data = await response.json();

        if (data.success && Array.isArray(data.pets)) {
          setPets(data.pets); // Set the pet data from the API response
        } else {
          console.error('Error: Invalid data format', data);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Fallback image URL
  const fallbackImageUrl = '/pet-logo.png';

  // Check if the image URL is valid (basic validation)
  const isValidImageUrl = (url: string) => {
    // Regular expression to check if the URL ends with a common image extension
    const regex = /\.(jpeg|jpg|gif|png|bmp)$/i;
    return regex.test(url);
  };

  // Handle image error to use fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImageUrl; // Set fallback image on error
  };

  // Handle image URL validation before rendering
  const getImageUrl = (imageUrl: string | null) => {
    if (imageUrl && isValidImageUrl(imageUrl)) {
      return imageUrl;
    }
    return fallbackImageUrl; // Fallback if URL is invalid or null
  };

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
        {loading ? (
          <Typography variant="h6" color="textSecondary">Loading pets...</Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {pets.length === 0 ? (
              <Typography variant="h6" color="textSecondary">No pets available for adoption at the moment.</Typography>
            ) : (
              pets.map((pet) => (
                <Grid item key={pet.pet_id} xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: 380, justifyContent: 'space-between' }}>

                    {/* Image Section */}
                    <Box sx={{ position: 'relative', width: '100%', height: 400, overflow: 'hidden' }}>
                      <Image
                        src={getImageUrl(pet.image_url)}  // Validate image URL here
                        alt={`Pet ${pet.name}`}
                        layout="fill" // Ensures the image takes the full space of the container
                        objectFit="cover" // Ensures the image covers the entire container without distortion
                        objectPosition="center" // Centers the image within the container
                        onError={handleImageError}  // Add the error handler here
                        style={{
                          borderRadius: '8px'  // Optional: for rounded corners
                        }}
                      />
                    </Box>

                    {/* Card Content Section */}
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                      <Typography variant="h6">{pet.name}</Typography>
                      <Typography variant="body2" color="textSecondary">Age: {pet.age} {pet.age_unit}</Typography>
                      <Button variant="contained" sx={{ mt: 2 }} fullWidth>Adopt Now</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))

            )}
          </Grid>
        )}
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
