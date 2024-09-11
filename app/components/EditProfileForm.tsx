"use client";

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';


interface EditProfileFormProps {
  user: {
    _id: string;
    name: string;
    bio: string;
  };
  onUpdateSuccess: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onUpdateSuccess }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const { updateUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${user._id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      });
      const data = await response.json();
      if (data.success) {
        updateUser({ name }); 
        toast.success('Profile updated successfully');
        onUpdateSuccess();
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Update Profile
      </Button>
    </Box>
  );
};

export default EditProfileForm;