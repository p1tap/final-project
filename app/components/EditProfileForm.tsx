"use client";

import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Avatar } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';


interface EditProfileFormProps {
  user: {
    _id: string;
    name: string;
    bio: string;
    profilePicture?: string;
    username: string;
  };
  onUpdateSuccess: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onUpdateSuccess }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const { updateUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
  
      const response = await fetch(`/api/users/${user._id}/edit`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        updateUser({ 
          name, 
          bio, 
          profilePicture: data.data.profilePicture,
          username: user.username
        }); 
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
      <Avatar
        src={previewUrl || undefined}
        sx={{ width: 100, height: 100, margin: '0 auto', mb: 2, cursor: 'pointer' }}
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />
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