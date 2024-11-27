// components/Footer.tsx
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        padding: '1rem 0',
        mt: 'auto',
        position: 'relative',
        bottom: 0,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} Your Company. All Rights Reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link href="/privacy" color="inherit" sx={{ mx: 1 }}>
            Privacy Policy
          </Link>
          |
          <Link href="/terms" color="inherit" sx={{ mx: 1 }}>
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
