'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography, Container, Grid, Alert, Link } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Log the full response to inspect it
    console.log('Login Response:', data);

    if (data.success) {
      // Store token and user_id in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user.user_id.toString());  // Make sure it's a string

      // Redirect based on role
      router.push(data.user.role === 'admin' ? '/admin' : '/adopter');
    } else {
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
          Login to PetAdopt
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
                sx={{ padding: '10px' }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <Link href="/register" underline="hover" sx={{ color: 'primary.main' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
