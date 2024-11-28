'use client';
import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Dynamically import ReactApexChart to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AdminDashboard = ({ darkMode }: { darkMode: boolean }) => {
  const [userStats, setUserStats] = useState([]);
  const [petStats, setPetStats] = useState([]);
  const [adoptionStats, setAdoptionStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [users, pets, applications] = await Promise.all([
          fetch('/api/analytics/users').then((res) => res.json()),
          fetch('/api/analytics/pets').then((res) => res.json()),
          fetch('/api/analytics/adoption-applications').then((res) => res.json()),
        ]);

        setUserStats(users);
        setPetStats(pets);
        setAdoptionStats(applications);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Chart Configurations
  const getChartOptions = (labels: string[], data: number[]): { series: number[]; options: ApexOptions } => ({
    series: data,
    options: {
      chart: {
        type: 'pie',
        toolbar: { show: false },
        background: darkMode ? '#121212' : '#ffffff', // Adjust background color
      },
      labels,
      legend: {
        position: 'bottom',
        labels: {
          colors: darkMode ? ['#ffffff'] : ['#000000'], // Adjust legend text color
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '50%', // Optionally adjust pie chart size
          },
        },
      },
      theme: {
        mode: darkMode ? 'dark' : 'light', // Ensure chart theme is applied
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  const userChart = getChartOptions(
    userStats.map((item: any) => item.role),
    userStats.map((item: any) => item.count)
  );

  const petChart = getChartOptions(
    petStats.map((item: any) => item.status),
    petStats.map((item: any) => item.count)
  );

  const adoptionChart = getChartOptions(
    adoptionStats.map((item: any) => item.status),
    adoptionStats.map((item: any) => item.count)
  );

  // Define themes for light and dark modes
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1D1D1D',
      },
      text: {
        primary: '#fff',
        secondary: '#b0b0b0',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h4: {
        fontWeight: 700,
        fontSize: '2rem',
        color: '#fff',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        color: '#fff',
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#ffffff',
        paper: '#f5f5f5',
      },
      text: {
        primary: '#000',
        secondary: '#4f4f4f',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h4: {
        fontWeight: 700,
        fontSize: '2rem',
        color: '#000',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        color: '#000',
      },
    },
  });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box p={6}>
        <Typography variant="h4" gutterBottom align="center">
          Admin Analytics Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                boxShadow: 3, // Added box shadow for better visibility
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  User Roles
                </Typography>
                <ReactApexChart options={userChart.options} series={userChart.series} type="pie" height={350} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                boxShadow: 3, // Added box shadow for better visibility
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Pet Status
                </Typography>
                <ReactApexChart options={petChart.options} series={petChart.series} type="pie" height={350} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                boxShadow: 3, // Added box shadow for better visibility
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Adoption Applications
                </Typography>
                <ReactApexChart options={adoptionChart.options} series={adoptionChart.series} type="pie" height={350} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
