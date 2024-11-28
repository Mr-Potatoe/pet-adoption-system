// app/admin/page.tsx
'use client'
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
      },
      labels,
      legend: {
        position: 'bottom',
      },
      theme: {
        mode: darkMode ? 'dark' : 'light',
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
  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box p={4}>
        <Typography variant="h4" gutterBottom align="center">
          Admin Analytics Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  User Roles
                </Typography>
                <ReactApexChart options={userChart.options} series={userChart.series} type="pie" height={350} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Pet Status
                </Typography>
                <ReactApexChart options={petChart.options} series={petChart.series} type="pie" height={350} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
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