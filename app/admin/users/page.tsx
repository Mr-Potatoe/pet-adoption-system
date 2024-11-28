'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { NextPage } from 'next';
import UserTable from '@/components/admin/user-page/UserTable';
import UserDialog from '@/components/admin/user-page/UserDialog';
import LoadingSpinner from '@/components/admin/user-page/LoadingSpinner';
import { User } from '@/types';

const AdminUsersPage: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, 'user_id'>>({
    username: '',
    email: '',
    role: 'adopter',
    profile_picture: null,
    password_hash: '', // This will be handled as a hashed password in the backend
    created_at: '', // Adjust this field to match your DB schema
  });


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenDialog = (user: User | null) => {
    setSelectedUser(user);
    if (user) {
      setNewUser({
        username: user.username,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
        password_hash: '', // Default empty password
        created_at: user.created_at || '', // Ensure proper value for `created_at`
      });
    } else {
      // Initialize with empty values when creating a new user
      setNewUser({
        username: '',
        email: '',
        role: 'adopter',
        profile_picture: null,
        password_hash: '',
        created_at: '', // Or null based on your logic
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSaveUser = async (user: Omit<User, 'user_id'>) => {
    try {
      const method = selectedUser ? 'PUT' : 'POST';
      const url = selectedUser ? `/api/users/${selectedUser.user_id}` : '/api/users';

      // If creating a user, ensure the password is passed as plain text
      const userData = {
        ...user,
        password: user.password_hash,  // Remove password_hash field when creating a new user
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData), // Send plain password
      });

      const responseData = await response.json();

      if (response.ok) {
        const updatedUser = responseData;
        if (selectedUser) {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user))
          );
        } else {
          setUsers((prevUsers) => [...prevUsers, updatedUser]);
        }
        setOpenDialog(false);
      } else {
        console.error('Failed to save user. Response:', responseData);
        alert(`Error: ${responseData.message || 'Failed to save user'}`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user');
    }
  };

  const handleChange = (field: keyof Omit<User, 'user_id'>, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };


  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Users
      </Typography>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
              Create New User
            </Button>
          </Box>

          <UserTable users={users} onEdit={handleOpenDialog} onDelete={handleDeleteUser} />
        </>
      )}

      <UserDialog
        open={openDialog}
        selectedUser={selectedUser}
        newUser={newUser}
        onClose={handleCloseDialog}
        onSave={handleSaveUser}
        onChange={handleChange}
      />
    </Box>
  );
};

export default AdminUsersPage;
