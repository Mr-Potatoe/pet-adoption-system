'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Pagination } from '@mui/material';

const AdoptionApplicationsPage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/adoption-applications`);
        const data = await response.json();

        console.log('Received data:', data);

        if (data.success && Array.isArray(data.applications)) {
          setApplications(data.applications);
          setTotalPages(Math.ceil(data.applications.length / 10)); // Assuming 10 applications per page
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Adoption Applications
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Pet Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.slice((currentPage - 1) * 10, currentPage * 10).map((application) => (
              <TableRow key={application.application_id}>
                <TableCell>{application.application_id}</TableCell>
                <TableCell>{application.user_name}</TableCell>
                <TableCell>{application.pet_name}</TableCell>
                <TableCell>{application.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" size="small">
                    Approve
                  </Button>
                  <Button variant="outlined" color="secondary" size="small">
                    Reject
                  </Button>
                  <Button variant="outlined" color="error" size="small">
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default AdoptionApplicationsPage;
