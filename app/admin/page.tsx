// pages/admin.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Alert, List, ListItem, ListItemText, CircularProgress, Box, Button, TextField, Stack } from '@mui/material';
import NavBar from '@/components/NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Admin = () => {
    const [pets, setPets] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [newPet, setNewPet] = useState({
        name: '',
        breed: '',
        age: '',
        description: '',
        medical_history: '',
        status: '',
        image_url: '',
        user_id: '',
        gender: '',
        contact: '',
        location: '',
        age_unit: '',
    });
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    // Sync pets fetching
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }

        const fetchPets = async () => {
            try {
                const response = await fetch('/api/pets'); // Adjust the API URL as needed
                const data = await response.json();
                if (data.success) {
                    setPets(data.pets);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Error fetching pets');
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [router]);

    // Handle form changes for adding new pet
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPet({
            ...newPet,
            [e.target.name]: e.target.value,
        });
    };

    // Handle adding new pet
    const handleAddPet = async () => {
        try {
            const response = await fetch('/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet),
            });
            const data = await response.json();
            if (data.success) {
                setPets((prevPets) => [...prevPets, data.pet]);
                setNewPet({
                    name: '',
                    breed: '',
                    age: '',
                    description: '',
                    medical_history: '',
                    status: '',
                    image_url: '',
                    user_id: '',
                    gender: '',
                    contact: '',
                    location: '',
                    age_unit: '',
                });
            } else {
                setError('Error adding pet');
            }
        } catch (error) {
            setError('Error adding pet');
        }
    };

    return (

        <>
            <NavBar onToggleTheme={setDarkMode} />

            <ThemeProvider theme={darkMode ? createTheme({ palette: { mode: 'dark' } }) : createTheme({ palette: { mode: 'light' } })}>
            <Container>
                <Typography variant="h3" gutterBottom>
                    Admin Dashboard
                </Typography>

                {/* Show error message if any */}
                {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

                {/* Pets List Section */}
                <Typography variant="h5" gutterBottom>
                    Pets List
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {pets.length > 0 ? (
                            pets.map((pet: any) => (
                                <ListItem key={pet.pet_id}>
                                    <ListItemText primary={pet.name} />
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.push(`/admin/pet-details/${pet.pet_id}`)}
                                    >
                                        View Details
                                    </Button>
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body1">No pets available.</Typography>
                        )}
                    </List>
                )}

                {/* Add New Pet Form */}
                <Typography variant="h5" gutterBottom>
                    Add New Pet
                </Typography>
                <TextField
                    label="Name"
                    fullWidth
                    name="name"
                    value={newPet.name}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Breed"
                    fullWidth
                    name="breed"
                    value={newPet.breed}
                    onChange={handleChange}
                    margin="normal"
                />
                {/* Add more fields as needed... */}
                <Button variant="contained" onClick={handleAddPet} sx={{ marginTop: 2 }}>
                    Add Pet
                </Button>
            </Container>
            </ThemeProvider>
        </>
    );
};

export default Admin;
