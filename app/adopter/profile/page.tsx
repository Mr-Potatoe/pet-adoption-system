'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Grid, Avatar } from '@mui/material';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [adoptionHistory, setAdoptionHistory] = useState<any[]>([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profile_picture: '',
        role: 'adopter', // Default role is 'adopter'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const decodedToken: any = jwt.decode(token);
        const userId = decodedToken?.userId;

        if (!userId) {
            setError('Unable to retrieve user information');
            setLoading(false);
            return;
        }

        // Fetch user profile data
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();

                if (data.user) { 
                    setUser(data.user);
                    setFormData({
                        username: data.user.username,
                        email: data.user.email,
                        password: '',  
                        profile_picture: data.user.profile_picture || '',
                        role: data.user.role || 'adopter',
                    });
                } else {
                    setError('Error fetching user data');
                }
            } catch (err) {
                setError('Error fetching user data');
                console.error(err);
            }
        };

        // Fetch adoption history
        const fetchAdoptionHistory = async () => {
            try {
                const response = await fetch(`/api/adoption-history?userId=${userId}`);
                const data = await response.json();
                if (data.success && data.history) {  
                    setAdoptionHistory(data.history);
                } else {
                    setError('Error fetching adoption history');
                }
            } catch (err) {
                setError('Error fetching adoption history');
                console.error(err);
            }
        };

        fetchUserProfile();
        fetchAdoptionHistory();
        setLoading(false);
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('User not authenticated');
            return;
        }

        const decodedToken: any = jwt.decode(token);
        const userId = decodedToken?.userId;

        if (!userId) {
            setError('Unable to retrieve user ID from token');
            return;
        }

        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.message) { 
            setUser(data.user);
            setEditing(false);
            setError('');
        } else {
            setError(data.message || 'Error updating profile');
        }
    };

    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: 4 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        User Profile
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box display="flex" justifyContent="center" mb={4}>
                        <Avatar
                            src={formData.profile_picture || '/default-avatar.png'}
                            sx={{ width: 100, height: 100 }}
                        />
                    </Box>

                    {editing ? (
                        <Box>
                            <TextField
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                label="Profile Picture URL"
                                name="profile_picture"
                                value={formData.profile_picture}
                                onChange={handleInputChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />

                            <Button variant="contained" onClick={handleProfileUpdate} fullWidth sx={{ mb: 2 }}>
                                Save Changes
                            </Button>

                            <Button variant="outlined" onClick={() => setEditing(false)} fullWidth>
                                Cancel
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h6">Username: {user?.username}</Typography>
                            <Typography variant="h6">Email: {user?.email}</Typography>
                            <Typography variant="h6">Profile Picture: {user?.profile_picture || 'No Profile Picture'}</Typography>
                            <Button variant="contained" onClick={() => setEditing(true)} fullWidth sx={{ mt: 2 }}>
                                Edit Profile
                            </Button>
                        </Box>
                    )}

                    <Box mt={4}>
                        <Typography variant="h5" gutterBottom>
                            Adoption History
                        </Typography>
                        {adoptionHistory.length === 0 ? (
                            <Typography>No adoption history available.</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {adoptionHistory.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} key={item.application_id}>
                                        <Box
                                            sx={{
                                                border: '1px solid #ccc',
                                                padding: 2,
                                                borderRadius: 2,
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Typography variant="h6">{item.pet_name}</Typography>
                                            <Typography>Breed: {item.breed}</Typography>
                                            <Typography>Age: {item.age} {item.age_unit}</Typography>
                                            <Typography>Status: {item.application_status}</Typography>
                                            <Typography>Date Applied: {new Date(item.application_date).toLocaleDateString()}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ProfilePage;
