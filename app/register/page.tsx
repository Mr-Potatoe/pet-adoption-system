'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button, Alert, Grid, Link, Box } from '@mui/material';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Role is hardcoded as 'adopter'
  const role: 'adopter' = 'adopter';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Sending POST request to API with user data
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await response.json();
    if (data.success) {
      // Show success message and reset form
      setSuccess(data.message);
      setUsername('');
      setEmail('');
      setPassword('');

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      // Show error message if registration fails
      setError(data.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>

        {/* Show success or error messages */}
        {success && <Alert severity="success" sx={{ width: '100%', marginBottom: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Link to Login page */}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Already have an account?{' '}
            <Link href="/login" variant="body2" color="primary">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
